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
        const pl = new ProgressList(ctx, {
            error: ctx.emote('error'),
            loading: ctx.emote('loading'),
            success: ctx.emote('success'),
        });
        const oldTime = Date.now();

        pl.add('pinging websocket...');
        pl.add('pinging discord');
        await pl.start();
        const msHTTP = Date.now() - oldTime;
        await pl.set('pinging discord', 'success');
        let msWS = 0;
        try {
            msWS = await ctx.client.gateway.ping(900);
            await pl.set('pinging websocket', 'success');
        } catch (error) {
            console.log(error);
            await pl.set('pinging websocket', 'error');
        }
        return ctx.ephemeral(
            `Pong! ${msHTTP}ms (${msWS}ms on  the websocket)`,
        );
    }
}
