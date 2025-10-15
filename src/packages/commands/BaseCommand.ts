import { NovaShardClient } from '@nova/core/client/ShardClient';
import { Interaction } from 'detritus-client';

export class BaseCommand extends Interaction.InteractionCommand {
    onBefore(
        context: Interaction.InteractionContext,
    ): Promise<boolean> | boolean {
        const client = context.client as NovaShardClient;
        client.logger.log(
            `[COMMAND_RUN] running command ${this.name}`,
        );
        client.stats.commands++;
        return true;
    }

    static applyOptions(
        options: Interaction.InteractionCommandOptions,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return function <
            T extends new (...args: unknown[]) => object,
        >(constructor: T): T {
            //@ts-expect-error Typescript does not like your mom
            return class T extends constructor {
                constructor(
                    old_options: Interaction.InteractionCommandOptions,
                ) {
                    super({
                        ...old_options,
                        ...options,
                    });
                }
            };
        };
    }
}
