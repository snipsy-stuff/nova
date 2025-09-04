import { NovaInteractionCommandClient } from '@nova/commands/InteractionCommandClient';
import { NovaShardClient } from '@nova/core/client/ShardClient';
import { CustomListenerHandler } from '@nova/listeners/ListenerHandler';
import { error } from 'console';
import { GatewayIntents } from 'detritus-client/lib/constants';
import { parseEnv } from 'packages/util/env';

const env = parseEnv('./.env.local');

if (!env.DISCORD_TOKEN) {
    throw new Error(
        'no token provided or found in .env.local file. please add it.',
    );
}

const client = new NovaShardClient(env.DISCORD_TOKEN, {
    gateway: {
        intents: [
            GatewayIntents.MESSAGE_CONTENT,
            GatewayIntents.GUILDS,
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
        console.error(JSON.stringify(err, null, 1));
        if (err.resposne.fetchResponse.status === 429) {
            return;
        }
        throw err;
    });
    await commands.run({ wait: true });
}

start().catch(console.error);
