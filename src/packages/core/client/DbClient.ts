import { GuildSetings } from '@nova/typings/db/guilds';
import { Db } from 'mongodb';

export class DbClient {
    db: Db;
    constructor(db: Db) {
        this.db = db;
    }

    get guilds() {
        return this.db.collection<GuildSetings>('guild_Settings');
    }
}
