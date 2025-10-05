import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { SubCommand } from '@nova/commands/options/SubCommand';
@SubCommand.applyOptions({
    name: 'edit',
    description: 'edit a sheet.',
    options: [
        new AutoComplete()
            .setName('name')
            .setDescription(
                'the name of the name of the character to delete.',
            ),
    ],
})
export class SheetEditCommand extends SubCommand {
    async exec(ctx: CustomContext<object>) {}
}
