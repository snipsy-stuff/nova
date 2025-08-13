import { CustomListener } from '@nova/listeners/CustomListener';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.EVENT_LOAD,
    emitter: 'events',
    id: 'events.event.load',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: { event: CustomListener }) {
        this.client.logger.debug(
            `Event ${data.event.id} ready.`,
            'INIT_CLIENT_LOAD',
        );
    }
}
