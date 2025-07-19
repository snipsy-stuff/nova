import { Logger } from '@nova/util/Logger';
import { ShardClient } from 'detritus-client';
import { PresenceOptions } from 'detritus-client-socket/lib/gateway';

export class NovaShardClient extends ShardClient {
    logger = new Logger('client');

    setPresence(presence: PresenceOptions) {
        return new Promise((res, rej) => {
            this.gateway.setPresence(
                presence,
                (error: Error | null) => {
                    if (error) {
                        return rej(error);
                    }
                    res(true);
                },
            );
        });
    }
}
