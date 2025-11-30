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
        const enbaled = false;

        if (!enbaled) return false;
        console.log(data.differences);

        console.log(`updated channel ${data.channel.name}`);
    }
}
