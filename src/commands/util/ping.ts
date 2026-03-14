import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { ProgressList } from '@nova/util/loadingListThing';
@CustomCommand.applyOptions({
    name: 'ping',
    description: 'pinging the bot. check if it is still alive.',
})
export default class PingCommand extends CustomCommand {
    async exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        const oldTime = Date.now();
        await ctx.say('pinging...');
        const msHTTP = Date.now() - oldTime;
        let msWS = 0;
        try {
            msWS = await ctx.client.gateway.ping(900);
        } catch (error) {
            console.log(error);
            return ctx.error('failed to ping.');
        }
        return ctx.ephemeral(
            `Pong! ${msHTTP}ms (${msWS}ms on  the websocket)`,
        );
    }
}
