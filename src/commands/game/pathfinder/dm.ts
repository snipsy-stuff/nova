import { RootCommand } from '@nova/commands/RootCommand';

@RootCommand.applyOptions({
    name: 'dm',
    description: 'dm helper',
})
export default class DungeonMasterCommand extends RootCommand {
    run() {}
}
