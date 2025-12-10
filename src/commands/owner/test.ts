import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { CustomListener } from '@nova/listeners/CustomListener';

@CustomCommand.ownerOnly()
@CustomCommand.applyOptions({
    name: 'test',
    description: 'pinging the bot. check if it is still alive.',
})
export default class PingCommand extends CustomCommand {
    async exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        return ctx.client.emit(
            CustomListener.eventNames.GUILD_MEMBER_ADD,
            { member: ctx.member },
        );
    }
}
