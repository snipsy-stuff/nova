import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.CHANNEL_CREATE,
    emitter: 'client',
    id: 'guild.channel.create',
    type: 'on',
    enabled: true,
})
export default class GuildChannelCreate extends CustomListener {
    async run(data: GatewayClientEvents.ChannelCreate) {
        console.log(`new channel ${data.channel.name}`);
    }
}
