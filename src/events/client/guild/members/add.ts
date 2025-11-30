import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_MEMBER_ADD,
    emitter: 'client',
    id: 'guild.members.add',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberAdd) {
        const enbaled = false;

        if (!enbaled) return false;

        console.log(`new user: ${data.member.name}`);
    }
}
