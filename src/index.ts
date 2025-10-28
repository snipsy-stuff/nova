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
if (env.BETA_TOKEN || env._DISCORD_TOKEN) {
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
        ],
    },
});
const commands = new NovaInteractionCommandClient(client);
const listeners = new CustomListenerHandler(client);

async function start() {
    listeners.addHandler('commands', commands);
    await listeners.loadAll();
    await commands.addMultipleIn('./commands/');
    await client.run({ wait: true });
    await commands.checkAndUploadCommands().catch((err) => {
        if (err.response.fetchResponse.status === 429) {
            return;
        }
        throw err;
    });
    await commands.run({ wait: true });
}

start().catch(console.error);
