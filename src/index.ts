import { NovaShardClient } from 'packages/client/ShardClient';
import { parseEnv } from 'packages/util/env';

const client = new NovaShardClient(parseEnv('./.env').DISCORD_TOKEN);
client.on('gatewayReady', () => console.log('ready.'));
