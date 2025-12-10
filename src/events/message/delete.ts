import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

const AI_ENABLED = false;

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_DELETE,
    emitter: 'client',
    id: 'client.message.delete',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageCreate) {
        const msg = data.message;
        if (!msg) return;
        if (!this.enabled) return;
        if (!msg.channel || msg.author.bot) return;
        console.log(`message deleted :${msg.id}`);
    }
}
