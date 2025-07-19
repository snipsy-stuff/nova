import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes } from 'detritus-client/lib/constants';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.GATEWAY_READY,
    emitter: 'client',
    id: 'client.gateway.ready',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.GatewayReady) {
        this.client.logger.log(
            `${data.raw.user.username} is now ready.`,
        );
        await this.client.setPresence({
            activities: [
                {
                    type: ActivityTypes.LISTENING,
                    name: 'your commands.',
                },
            ],
        });
    }
}
