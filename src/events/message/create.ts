import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
// import { Message } from 'detritus-client/lib/structures';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_CREATE,
    emitter: 'client',
    id: 'client.message.create',
    type: 'on',
    enabled: false,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageCreate) {
        const msg = data.message;
        if (!this.enabled) return;
        if (!msg.content || !msg.channel || msg.author.bot) return;
    }
}
