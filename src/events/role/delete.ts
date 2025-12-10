import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_ROLE_DELETE,
    emitter: 'client',
    id: 'guild.role.delete',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildRoleDelete) {
        console.log(`new user: ${data.role?.id ?? data.roleId}`);
    }
}
