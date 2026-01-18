import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_MEMBER_UPDATE,
    emitter: 'client',
    id: 'guild.members.update',
    type: 'on',
    enabled: false,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberUpdate) {
        console.log(`updated user: ${data.member.name}`);
    }
}
