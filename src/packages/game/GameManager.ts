import { NovaShardClient } from '@nova/core/client/ShardClient';
import { EconomyManager } from './economy/EconomyManager';
import { Pathfinder } from './pathfinder/Pathfinder';

export class GameManager {
    economy = new EconomyManager(this);
    pathfinder = new Pathfinder(this);
    constructor(public readonly client: NovaShardClient) {}
}
