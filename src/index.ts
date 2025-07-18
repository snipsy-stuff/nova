import { NovaShardClient } from 'packages/client/ShardClient';
import { parseEnv } from 'packages/util/env';

const client = new NovaShardClient(
    parseEnv('./.env.local').DISCORD_TOKEN,
);
client.on('gatewayReady', () => console.log('ready.'));

async function start() {
    await client.run({ wait: true });
}

start().catch(console.error);
