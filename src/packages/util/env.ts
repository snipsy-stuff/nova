import * as fs from 'fs';
/**
 * typing information of the .env file.
 */
interface Env {
    DISCORD_TOKEN: string;
    DISCORD_BOT_MODE: string;
}
/**
 *
 * @param filePath the path to the .env file
 * @returns
 */
export function parseEnv(filePath: string): Env {
    const envData: Record<string, string> = {};

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const lines = fileContent.split('\n');

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            const [key, ...value] = trimmedLine.split('=');

            if (key && value !== undefined) {
                envData[key.trim()] = value.join('=').trim();
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            const errnoError = error as NodeJS.ErrnoException;

            if (errnoError.code === 'ENOENT') {
                console.error(`File not found: ${filePath}`);
                return {
                    DISCORD_BOT_MODE: '',
                    DISCORD_TOKEN: '',
                };
            }
        } else {
            console.error('An unknown error occurred.');
        }
        throw error;
    }

    return envData as unknown as Env;
}
