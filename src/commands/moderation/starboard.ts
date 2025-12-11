import { RootCommand } from 'packages/commands/RootCommand';
import { StarboardSetupCommand } from './starboard/setup';
@RootCommand.requirePermission(['MANAGE_GUILD'])
@RootCommand.applyOptions({
    name: 'starboard',
    description: 'setup sa reaction triggered starboard',
    options: [new StarboardSetupCommand()],
})
export default class SetupCommand extends RootCommand {
    // async setupModlog(
    //     guild: GuildContext<Record<string, undefined>>['guild'],
    // ) {}
}
