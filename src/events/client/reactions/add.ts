import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_REACTION_ADD,
    emitter: 'client',
    id: 'client.reaction.add',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageReactionAdd) {
        // const emoji = {};
        // if (data.reaction.emoji === emoji) {
        //     const channel = await this.client.rest.fetchChannel(
        //         data.channelId,
        //     );
        //     if (!channel) return;
        //     const lastMessages = await channel
        //         ?.fetchMessages({
        //             limit: 5,
        //         })
        //         .then((msgs) =>
        //             msgs.map((m) => `${m.author.name}:${m.content}`),
        //         );
        //     if (!lastMessages) return;
        //     const content =
        //         await this.client.lmstudio.request(lastMessages);
        //     await channel.createMessage({
        //         content: content,
        //     });
        // }
    }
}
