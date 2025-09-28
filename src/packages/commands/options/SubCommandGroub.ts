import { Interaction } from 'detritus-client';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommandOption } from 'detritus-client/lib/interaction';

export class SubCommandGroup extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
        });
    }
    static applyOptions(
        options: Interaction.InteractionCommandOptionOptions,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return function <
            T extends new (...args: unknown[]) => object,
        >(constructor: T): T {
            //@ts-expect-error Typescript does not like your mom
            return class T extends constructor {
                constructor(
                    old_options: Interaction.InteractionCommandOptionOptions,
                ) {
                    super({
                        ...old_options,
                        ...options,
                        type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    });
                }
            };
        };
    }
}
