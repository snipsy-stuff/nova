import { NovaInteractionCommandClient } from '@nova/commands/InteractionCommandClient';
import { NovaShardClient } from '@nova/core/client/ShardClient';
import { CustomListenerHandler } from '@nova/listeners/ListenerHandler';
import { GatewayIntents } from 'detritus-client/lib/constants';
import { parseEnv } from 'packages/util/env';

const env = parseEnv('./.env.local');

let token = '';

if (env.PRIMARY_TOKEN || env.DISCORD_TOKEN) {
    token = (env.PRIMARY_TOKEN || env.DISCORD_TOKEN) as string;
}
if (!token && (env.BETA_TOKEN || env._DISCORD_TOKEN)) {
    token = (env.BETA_TOKEN || env._DISCORD_TOKEN) as string;
}
if (!token) {
    throw new Error(
        'no token provided or found in .env.local file. please add it.',
    );
}

const client = new NovaShardClient(token, {
    gateway: {
        intents: [
            GatewayIntents.MESSAGE_CONTENT,
            GatewayIntents.GUILDS,
            GatewayIntents.GUILD_MESSAGE_REACTIONS,
            GatewayIntents.GUILD_MESSAGES,
            GatewayIntents.MESSAGE_CONTENT,
            GatewayIntents.GUILD_PRESENCES,
            GatewayIntents.GUILD_MEMBERS,
            GatewayIntents.GUILD_VOICE_STATES,
        ],
    },
});
const commands = new NovaInteractionCommandClient(client);
const listeners = new CustomListenerHandler(client);

async function start() {
    listeners.addHandler('commands', commands);
    client.logger.debug('loading events', 'start-up');
    await listeners.loadAll();
    client.logger.debug(
        `loaded ${listeners.modules.length} events, loading commands.`,
        'start-up',
    );
    await commands.addMultipleIn('./commands/');
    client.logger.debug(
        `loaded ${commands.commands.length} commands, connecting to the db`,
        'start-up',
    );

    await client.start();
    client.logger.debug(
        'connected. Reaching out to Discord.',
        'start-up',
    );
    await client.run({ wait: true });
    client.logger.debug(
        `Done. Uploading ${commands.commands.length} commands to Discord.`,
        'start-up',
    );
    await commands.checkAndUploadCommands().catch((err) => {
        if (err.response.fetchResponse.status === 429) {
            return;
        }
        throw err;
    });
    client.logger.debug(`Done. Running command client.`, 'start-up');
    await commands.run({ wait: true });
}

start().catch((err) => {
    console.error(err);
});
