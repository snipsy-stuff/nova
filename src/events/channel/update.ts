import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.CHANNEL_UPDATE,
    emitter: 'client',
    id: 'guild.channel.UPDATE',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.ChannelUpdate) {
        console.log(`updated channel ${data.channel.name}`);
    }
}
