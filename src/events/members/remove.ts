import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_MEMBER_REMOVE,
    emitter: 'client',
    id: 'guild.members.remove',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberRemove) {
        console.log(`user left: ${data.member?.name ?? data.userId}`);
    }
}
