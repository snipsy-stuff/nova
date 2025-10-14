import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
@CustomCommand.applyOptions({
    name: 'printers',
    description: 'pinging the bot. check if it is still alive.',
    onBefore: (c) => {
        return ['1234788180046123080', '735199620803854428'].includes(
            c.userId,
        );
    },
})
export default class PingCommand extends CustomCommand {
    exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        return ctx.say('pong!', { flags: 64 });
    }
}
