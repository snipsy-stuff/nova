import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

const AI_ENABLED = false;

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
        if (AI_ENABLED) {
            if (!msg.content.startsWith(`<@${msg.client.userId}>`))
                return;
            const lastMessages = await msg.channel?.fetchMessages({
                limit: 15,
            });

            const resp = await this.client.lmstudio.request(
                lastMessages.map((m) => `${m.author}:${m.content}`),
            );
            await msg.channel.createMessage({
                content: resp[0],
            });
        }
    }
}
