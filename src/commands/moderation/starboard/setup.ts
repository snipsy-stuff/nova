import { NoArgGuildContext } from '@nova/commands/CustomInteractionContext';
import { SubCommand } from '@nova/commands/options/SubCommand';

@SubCommand.applyOptions({
    name: 'setup',
    description:
        'a simple tool for setting all items of the starboard in one command.',
})
export class StarboardSetupCommand extends SubCommand {
    async exec(ctx: NoArgGuildContext) {
        const collection = ctx.client.db.guilds;
        const existing = await collection.findOne({
            guildId: ctx.guildId,
        });

        if (existing) {
            return ctx.error('already set up. exiting.');
        }
    }
}
