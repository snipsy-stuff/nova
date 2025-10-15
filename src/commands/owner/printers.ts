import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';

@CustomCommand.ownerOnly()
@CustomCommand.applyOptions({
    name: 'printers',
    description: 'pinging the bot. check if it is still alive.',
})
export default class PingCommand extends CustomCommand {
    exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        return ctx.say('pong!', { flags: 64 });
    }
}
