import { CustomListener } from '@nova/listeners/CustomListener';
import { parseEnv } from '@nova/util/env';
import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GATEWAY_READY,
    emitter: 'client',
    id: 'client.gateway.ready',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.GatewayReady) {
        await this.client.setPresence({
            activities: [
                {
                    type: ActivityTypes.LISTENING,
                    name: 'your commands.',
                },
            ],
        });

        let app = this.client.application;
        if (!app) {
            app = await this.client.rest.fetchApplication(
                this.client.userId,
            );
        }

        if (!app) {
            throw app;
        }

        const guilds = app.approximateGuildCount;
        const users = app?.approximateUserInstallCount;
        this.client.logger.log(
            `${data.raw.user.username} is now ready.` +
                `Installed on ${guilds} Server(s) and ${users} user(s) `,
        );
        const existing = parseEnv();
        if (existing.BOOT_LOG_CHANNEL) {
            const channel = this.client.channels.get(
                existing.BOOT_LOG_CHANNEL,
            ) as ChannelGuildText;
            if (channel) {
                const embed = new Embed().setDescription(`booted.`);

                await channel
                    .createMessage({ embeds: [embed] })
                    .catch(console.error);
            }
        }
    }
}
