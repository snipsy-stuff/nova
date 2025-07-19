import { NovaShardClient } from '@nova/core/client/ShardClient';
import { ClientEvents } from 'detritus-client/lib/constants';
import { EventOptions } from 'packages/typings/events';

export abstract class CustomListener implements EventOptions {
    client!: NovaShardClient;
    event: string;
    emitter: string;
    enabled?: boolean | undefined;
    type: 'on' | 'once';
    id: string;

    constructor(opts: EventOptions) {
        this.event = opts.event;
        this.emitter = opts.emitter;
        this.type = opts.type;
        this.id = opts.id;
        this.enabled = opts.enabled === true;
    }

    abstract run(...data: unknown[]): unknown;

    static applyOptions(
        options: EventOptions,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return function <
            T extends new (...args: unknown[]) => unknown,
        >(constructor: T): T {
            // @ts-expect-error Ts does not like decorators
            return class extends constructor {
                constructor(opts: EventOptions) {
                    super({
                        ...opts,
                        ...options,
                    });
                }
            };
        };
    }

    static get eventNames() {
        return {
            ...ClientEvents,
            CLIENT_ERROR: 'client_error',
            INTERACTION_COMMAND_RUN: 'interaction_command_run',
            CLIENT_DEBUG: 'client_debug',
            EVENT_LOAD: 'events_load',
        };
    }
}
