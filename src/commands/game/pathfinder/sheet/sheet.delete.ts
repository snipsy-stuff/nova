import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
@SubCommand.applyOptions({
    name: 'delete',
    description: 'delete a sheet.',
    options: [
        new StringOption()
            .setName('name')
            .setDescription(
                'the name of the name of the character to delete.',
            ),
    ],
})
export class SheetTransferCommand extends SubCommand {
    async exec(ctx: CustomContext<object>) {}
}
