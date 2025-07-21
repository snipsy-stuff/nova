// import { SheetInfoCommand } from './sheet/sheet.info';

import { RootCommand } from 'packages/commands/RootCommand';
import { SheetAddCommand } from './sheet/sheet.add';
import { SheetInfoCommand } from './sheet/sheet.info';
@RootCommand.applyOptions({
    name: 'sheet',
    description: 'root command for all the stuff to do with sheets',
    options: [new SheetInfoCommand(), new SheetAddCommand()],
})
export default class SheetCommand extends RootCommand {}
