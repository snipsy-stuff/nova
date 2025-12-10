import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_REACTION_REMOVE,
    emitter: 'client',
    id: 'client.reaction.remove',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageReactionRemove) {
        if (data) console.log('removed reaction');
    }
}
