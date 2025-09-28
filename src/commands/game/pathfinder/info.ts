import { RootCommand } from 'packages/commands/RootCommand';
import { SpellInfoCommand } from './info/info.spell';
@RootCommand.applyOptions({
    name: 'info',
    description:
        'root command for all the stuff to get info about spells etc.',
    options: [new SpellInfoCommand()],
})
export default class SheetCommand extends RootCommand {}
