import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_DELETE,
    emitter: 'client',
    id: 'client.message.delete',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageCreate) {
        const msg = data.message;
        if (!msg) return;
        if (!this.enabled) return;
        if (!msg.channel || msg.author.bot) return;

        const collection = this.client.db.guilds;

        if (msg.guild) {
            const settings = await collection.findOne({
                guildId: msg.guild.id,
            });
            if (settings?.mod_log) {
                if (!settings.mod_log.enabled) return;
                if (!settings.mod_log.messages) return;
                if (!settings.mod_log.channel) return;

                const channel = msg.guild.channels.get(
                    settings.mod_log.channel,
                ) as ChannelGuildText;
                if (!channel) return;

                const embed = new Embed()
                    .setColor(0xbc2e29)
                    .setAuthor(msg.author.name, msg.author.avatarUrl)
                    .setTimestamp()
                    .setDescription(
                        `Message Deleted in #${msg.channel.name}\n${msg.content}`,
                    );

                if (channel.canMessage && channel.canEmbedLinks) {
                    await channel.createMessage({ embeds: [embed] });
                }
            }
        }
    }
}
