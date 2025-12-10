import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.CHANNEL_DELETE,
    emitter: 'client',
    id: 'guild.channel.delete',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.ChannelDelete) {
        console.log(`deleted channel ${data.channel.name}`);
    }
}
