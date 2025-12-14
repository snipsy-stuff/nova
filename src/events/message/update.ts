import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_UPDATE,
    emitter: 'client',
    id: 'client.message.update',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageUpdate) {
        let msg = data.message;
        if (!msg)
            msg = await this.client.rest.fetchMessage(
                data.channelId,
                data.messageId,
            );
        if (!msg) return;
        if (!this.enabled) return;
        if (!msg.channel || msg.author.bot || data.isEmbedUpdate)
            return;
        console.log(`message updated: ${msg.id}`);
        if (!data.differences) return;
        if (msg.guild) {
            if (data.differences.content) {
                const settings = await this.client.db.guilds.findOne({
                    guildId: msg.guild?.id,
                });

                if (
                    !(
                        settings?.mod_log?.enabled ||
                        settings?.mod_log?.messages
                    )
                )
                    return;

                const channel = msg.guild.channels.get(
                    settings.mod_log.channel,
                ) as ChannelGuildText;
                if (!channel) return;

                const embed = new Embed()
                    .setColor(0xbc2e29)
                    .setAuthor(msg.author.name, msg.author.avatarUrl)
                    .setTimestamp()
                    .setDescription(
                        `Message updatedd in #${msg.channel.name}\n## old${msg.content ?? '<no content>'}\n## new ${data.differences.content}`,
                    );

                if (channel.canMessage && channel.canEmbedLinks) {
                    await channel.createMessage({ embeds: [embed] });
                }
            }
        }
    }
}
