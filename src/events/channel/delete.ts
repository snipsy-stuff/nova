import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.CHANNEL_DELETE,
    emitter: 'client',
    id: 'client.channel.delete',
    type: 'on',
    enabled: false,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.ChannelDelete) {
        const createdChannel = data.channel;
        if (!createdChannel) return;
        if (!this.enabled) return;
        if (!createdChannel.guild) return;

        const collection = this.client.db.guilds;

        if (createdChannel.guild) {
            const settings = await collection.findOne({
                guildId: createdChannel.guild.id,
            });
            if (settings?.mod_log) {
                if (!settings.mod_log.enabled) return;
                if (!settings.mod_log.channels) return;
                if (!settings.mod_log.channel) return;

                const channel = createdChannel.guild.channels.get(
                    settings.mod_log.channel,
                ) as ChannelGuildText;
                if (!channel) return;

                const embed = new Embed()
                    .setColor(0xbc2e29)
                    .setTimestamp()
                    .setDescription(
                        `Deleted channel: ${createdChannel.name}`,
                    );

                if (channel.canMessage && channel.canEmbedLinks) {
                    await channel.createMessage({ embeds: [embed] });
                }
            }
        }
    }
}
