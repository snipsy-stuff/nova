import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

@CustomListener.applyOptions({
    emitter: 'client',
    event: CustomListener.eventNames.INTERACTION_CREATE,
    id: 'client.interaction.create',
    type: 'on',
    enabled: true,
})
export default class InteractionCreateListener extends CustomListener {
    run(data: GatewayClientEvents.InteractionCreate) {
        this.client.logger.debug(
            `running interaction: ${data.interaction.id}`,
            'INTERACTION_CREATE',
        );
    }
}
