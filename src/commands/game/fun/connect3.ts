import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
@CustomCommand.applyMetaData({
    nsfw: false,
})
@CustomCommand.applyOptions({
    name: 'connec3',
    description: 'play connect3',
})
export default class Connect3 extends CustomCommand {
    async exec(ctx: CustomContext<Record<string, unknown>>) {
        return;
    }
}
