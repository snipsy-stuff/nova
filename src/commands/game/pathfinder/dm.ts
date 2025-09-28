import { RootCommand } from '@nova/commands/RootCommand';

@RootCommand.applyOptions({
    name: 'dm',
    description: '',
})
export default class DungeonMasterCommand extends RootCommand {}
