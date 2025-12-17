import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { CustomListener } from '@nova/listeners/CustomListener';

@CustomCommand.ownerOnly()
@CustomCommand.applyOptions({
    name: 'test',
    description: 'pinging the bot. check if it is still alive.',
})
export default class TestCommand extends CustomCommand {
    async exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        const data = await ctx.guild?.fetchAuditLogs({});
        console.log(data?.map((audit) => audit.actionType));
        return ctx.say(data?.length.toString() || 'no');
    }
}
