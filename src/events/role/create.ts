import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_ROLE_CREATE,
    emitter: 'client',
    id: 'guild.role.create',
    type: 'on',
    enabled: true,
})
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildRoleCreate) {
        console.log(`new user: ${data.role.id}`);
    }
}
