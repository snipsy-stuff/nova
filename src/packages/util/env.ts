import * as fs from 'fs';
import util from 'node:util';
/**
 * typing information of the .env file.
 */
interface Env {
    DISCORD_TOKEN: string;
    BOOT_LOG_CHANNEL: string;
    COMMAND_LOG_CHANNEL: string;
    ERROR_LOG_CHANNEL: string;
    JOIN_LOG_CHANNEL: string;
    GITHUB_TOKEN: string;
}
/**
 *
 * @param filePath the path to the .env file
 * @returns
 */
export function parseEnv(filePath = './.env.local'): Env {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return util.parseEnv(fileContent) as unknown as Env;
    } catch (error) {
        if (error instanceof Error) {
            const errnoError = error as NodeJS.ErrnoException;

            if (errnoError.code === 'ENOENT') {
                console.error(`File not found: ${filePath}`);
                return {
                    DISCORD_TOKEN: '',
                    BOOT_LOG_CHANNEL: '',
                    COMMAND_LOG_CHANNEL: '',
                    ERROR_LOG_CHANNEL: '',
                    JOIN_LOG_CHANNEL: '',
                    GITHUB_TOKEN: '',
                };
            }
        } else {
            console.error('An unknown error occurred.');
        }
        throw error;
    }
}
