import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_CREATE,
    emitter: 'client',
    id: 'client.message.create',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageCreate) {
        const msg = data.message;
        if (!this.enabled) return;
        if (!msg.content || !msg.channel || msg.author.bot) return;
    }
}
