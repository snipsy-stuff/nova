import { NovaShardClient } from '@nova/core/client/ShardClient';
import { CustomListenerHandler } from '@nova/listeners/ListenerHandler';
import { parseEnv } from 'packages/util/env';

const client = new NovaShardClient(
    parseEnv('./.env.local').DISCORD_TOKEN,
);

const listeners = new CustomListenerHandler(client);
client.on('gatewayReady', () => console.log('ready.'));

async function start() {
    await listeners.loadAll();
    await client.run({ wait: true });
}

start().catch(console.error);
