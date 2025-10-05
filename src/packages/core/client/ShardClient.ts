import { Logger } from '@nova/util/Logger';
import { ShardClient } from 'detritus-client';
import { PresenceOptions } from 'detritus-client-socket/lib/gateway';
import { LmStudio } from 'packages/ai/LMStudio';
import { GameManager } from 'packages/game/GameManager';

export class NovaShardClient extends ShardClient {
    logger = new Logger('nova');
    games: GameManager = new GameManager(this);
    lmstudio = new LmStudio();
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
