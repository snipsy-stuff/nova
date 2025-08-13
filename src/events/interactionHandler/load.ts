import { CustomListener } from '@nova/listeners/CustomListener';
import { CustomCommand } from '@nova/commands/CustomCommand';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.COMMAND_LOAD,
    emitter: 'commands',
    id: 'commands.command.load',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: { command: CustomCommand }) {
        this.client.logger.debug(
            `Command ${data.command.name} ready.`,
            'INIT_CLIENT_LOAD',
        );
    }
}
