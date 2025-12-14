import { RootCommand as CustomCommand } from '@nova/commands/RootCommand';
import { ModlogSubCommand } from './setup/setup.modlog';
@CustomCommand.requirePermission(['MANAGE_GUILD'])
@CustomCommand.applyOptions({
    name: 'setup',
    description: 'Root command for setting up moderative actions',
    options: [new ModlogSubCommand()],
})
export default class SetupCommand extends CustomCommand {}
