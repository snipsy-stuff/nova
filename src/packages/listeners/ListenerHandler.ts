import { EventEmitter } from 'events';
import { join, resolve } from 'path';
import fs from 'fs';
import { CustomListener } from './CustomListener';
import { BaseCollection } from 'detritus-client/lib/collections';
import { NovaShardClient } from 'packages/core/client/ShardClient';
export class CustomListenerHandler extends EventEmitter {
    modules: BaseCollection<string, CustomListener>;
    handlers: BaseCollection<string, EventEmitter>;
    constructor(public client: NovaShardClient) {
        super({
            captureRejections: true,
        });
        this.modules = new BaseCollection();
        this.handlers = new BaseCollection();
        this.handlers.set('client', client);
        this.handlers.set('events', this);
    }

    addHandler(name: string, handler: EventEmitter) {
        this.handlers.set(name, handler);
        return this;
    }

    setHandlers(x: Record<string, EventEmitter>) {
        for (const [name, handler] of Object.entries(x)) {
            this.addHandler(name, handler);
        }
        return this;
    }

    async loadAll() {
        const dir = resolve(process.cwd(), 'dist', 'events');

        const files = this.readdirRecursive(dir);
        for (const file of files) {
            await this.load(file);
        }
    }

    async load(file: string) {
        try {
            const obj = await import(file).then(
                (data) => data.default.default,
            );

            if (!obj) return;

            const f = new obj();
            const handler = this.handlers.get(f.emitter);
            if (!handler) {
                throw new Error('NO_VALID_HANDLER');
            }
            f.client = this.client;
            if (!f.enabled) return;
            f.handler = this;
            handler[f.type as 'on'](f.event, (...args: unknown[]) => {
                return this.modules.get(f.id)?.run(...args);
            });

            this.modules.set(f.id, f);
            this.emit('events_load', {
                event: f,
            });
        } catch (error) {
            console.error(`Error on file: ${file}`, error);
            this.emit('error', {
                file,
                error,
            });
        }
    }

    readdirRecursive(directory: string) {
        const result = [];

        (function read(dir) {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filepath = join(dir, file);

                if (fs.statSync(filepath).isDirectory()) {
                    read(filepath);
                } else {
                    result.push(filepath);
                }
            }
        })(directory);

        return result;
    }
}
