import { DiscordHTTPError } from '@nova/core/errors';
import { Interaction } from 'detritus-client';
import { Context } from 'vm';
import { CustomContext } from './CustomInteractionContext';
import { BaseCommand } from './BaseCommand';
import { owners } from '@nova/util/Constants';

export abstract class CustomCommand extends BaseCommand {
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
            console.log(error);
            if (error instanceof DiscordHTTPError) {
                return ctx.say(
                    [
                        '```json',
                        JSON.stringify(error.errors, null, 2),
                        '```',
                    ].join('\n'),
                );
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static ownerOnly(): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (constructor: any) => {
            return class T extends constructor {
                async exec(ctx: Context) {
                    if (!owners.includes(ctx.userId)) {
                        throw new Error('NO_OWNER');
                    }
                    return super.exec(ctx);
                }
            };
        };
    }
}
