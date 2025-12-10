import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_UPDATE,
    emitter: 'client',
    id: 'client.message.update',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageUpdate) {
        let msg = data.message;
        if (!msg)
            msg = await this.client.rest.fetchMessage(
                data.channelId,
                data.messageId,
            );
        if (!msg) return;
        if (!this.enabled) return;
        if (!msg.channel || msg.author.bot || data.isEmbedUpdate)
            return;
        console.log(`message updated: ${msg.id}`);
    }
}
