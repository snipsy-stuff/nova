import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_ROLE_UPDATE,
    emitter: 'client',
    id: 'guild.role.update',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildRoleUpdate) {
        console.log(`new user: ${data.role.id}`);
    }
}
