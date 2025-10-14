import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

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

        console.log(msg.content);
        if (!this.enabled) return;
        if (!msg.content || !msg.channel || msg.author.bot) return;
        if (!msg.content.startsWith(`<@${msg.client.userId}>`))
            return;
        const lastMessages = await msg.channel?.fetchMessages({
            limit: 15,
        });

        const resp = await this.client.lmstudio.request(
            lastMessages.map((m) => `${m.author}:${m.content}`),
        );
        console.log(resp);
    }
}
