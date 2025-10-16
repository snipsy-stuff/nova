import { DiscordHTTPError } from '@nova/core/errors';
import { Interaction } from 'detritus-client';
import { CustomContext } from './CustomInteractionContext';
import { BaseCommand } from './BaseCommand';

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
                        error.name + ':' + error.message,
                        '```',
                    ].join('\n'),
                );
            }
        }
    }
}
