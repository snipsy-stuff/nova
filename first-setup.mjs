// configPrompt.js
import readline from 'readline';
import fs from 'fs/promises';
export async function getUserInputs() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const ask = (question) =>
        new Promise((resolve) => rl.question(question, resolve));

    const config = {};

    config.DISCORD_TOKEN = await ask('Enter your DISCORD_TOKEN: ');
    const tokencheck = /^[\w-]{24}\.[\w-]{6}\.[\w-]{27}$/;
    if (!config.DISCORD_TOKEN) {
        const cenv = process.env.DISCORD_TOKEN; // fallback to enviromental varriables.
        if (!cenv) {
            throw new Error(
                'This Program requires a Discord bot token to be present.',
            );
        } else {
            config.DISCORD_TOKEN = cenv;
        }
    }
    if (!tokencheck.test(config.DISCORD_TOKEN)) {
        throw new Error('Invalid discord token provided.');
    }

    config.BOOT_LOG_CHANNEL =
        (await ask('Enter BOOT_LOG_CHANNEL (optional): ')) || null;
    config.COMMAND_LOG_CHANNEL =
        (await ask('Enter COMMAND_LOG_CHANNEL (optional): ')) || null;
    config.ERROR_LOG_CHANNEL =
        (await ask('Enter ERROR_LOG_CHANNEL (optional): ')) || null;
    config.JOIN_LOG_CHANNEL =
        (await ask('Enter JOIN_LOG_CHANNEL (optional): ')) || null;

    rl.close();

    let configFileData = '';
    const configfile = './.env.local';

    for (const key of Object.keys(config)) {
        configFileData += `${key}=${config[key] ? config[key] : ''}\n`;
    }
    console.log(configFileData);
    await fs.writeFile(configfile, configFileData);
}

console.log(await getUserInputs());
