import { GuildSetings } from '@nova/typings/db/settings.guilds';
import { Db } from 'mongodb';

export class DbClient {
    db!: Db;
    constructor(db?: Db) {
        this.db = db!;
    }

    get pets() {
        return this.db.collection;
    }

    get guilds() {
        return this.db?.collection<GuildSetings>('guild_settings');
    }
}
