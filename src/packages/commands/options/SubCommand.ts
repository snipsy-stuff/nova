import { Interaction } from 'detritus-client';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { CustomContext } from 'packages/commands/CustomInteractionContext';

export abstract class SubCommand extends Interaction.InteractionCommandOption {
    abstract exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown>;

    async run(
        context: Interaction.InteractionContext,
        args: Interaction.ParsedArgs,
    ) {
        const ctx = CustomContext.fromContext(context, args);
        try {
            await this.exec(ctx);
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'ALREADY_EXIST_NAME':
                        return ctx.error(
                            'A Por file with that name already exists. please rename it!',
                        );
                }
            }
            console.log(error);
            return ctx.error(
                'Could not run command for unknown reasons. please try again later',
            );
        }
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
