import { NovaInteractionCommandClient } from '@nova/commands/InteractionCommandClient';
import { NovaShardClient } from '@nova/core/client/ShardClient';
import { CustomListenerHandler } from '@nova/listeners/ListenerHandler';
import { parseEnv } from 'packages/util/env';

const env = parseEnv('./.env.local');

if (!env.DISCORD_TOKEN) {
    throw new Error(
        'no token provided or found in .env.local file. please add it.',
    );
}

const client = new NovaShardClient(env.DISCORD_TOKEN);
const commands = new NovaInteractionCommandClient(client);
const listeners = new CustomListenerHandler(client);

async function start() {
    listeners.addHandler('commands', commands);
    await listeners.loadAll();
    await commands.addMultipleIn('./commands/');
    await client.run({ wait: true });
    await commands.checkAndUploadCommands();
    await commands.run({ wait: true });
}

start().catch(console.error);
