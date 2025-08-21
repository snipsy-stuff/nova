import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { SubCommand } from '@nova/commands/options/SubCommand';
@SubCommand.applyOptions({
    name: 'transfer',
    description: 'transfers a sheet to a different user [DM only]',
})
export class SheetTransferCommand extends SubCommand {
    async exec(ctx: CustomContext<object>) {
        return ctx.error('command disabled.');
    }
}
