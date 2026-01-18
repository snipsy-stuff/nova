import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { BaseCollection } from 'detritus-client/lib/collections';
import { Permissions } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed, PermissionTools } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_DELETE,
    emitter: 'client',
    id: 'client.message.delete',
    type: 'on',
    enabled: false,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    ratelimit = new BaseCollection<string, string[]>();
    async run(data: GatewayClientEvents.MessageCreate) {
        const msg = data.message;
        if (!msg) return;
        if (msg.content === 'USER_WAS_BANNED') return;
        if (!this.enabled) return;
        if (!msg.channel || msg.author.bot) return;
        if (!msg.guild) return;

        const collection = this.client.db.guilds;

        if (msg.guild) {
            const settings = await collection.findOne({
                guildId: msg.guild.id,
            });
            if (settings?.mod_log) {
                if (!settings.mod_log.enabled) return;
                if (!settings.mod_log.messages) return;
                if (!settings.mod_log.channel) return;
                if (
                    PermissionTools.checkPermissions(
                        Permissions.VIEW_AUDIT_LOG,
                        msg.guild.me?.permissions ?? 0n,
                    )
                ) {
                    const checkforban = (
                        await msg.guild.fetchAuditLogs({})
                    ).first();
                    if (checkforban?.actionType === 22) {
                        return;
                    }
                }
                const channel = msg.guild.channels.get(
                    settings.mod_log.channel,
                ) as ChannelGuildText;
                if (!channel) return;
                if (
                    this.ratelimit.has(
                        `${msg.guild.id}:${msg.author.id}`,
                    )
                ) {
                    this.ratelimit.set(
                        `${msg.guild.id}:${msg.author.id}`,
                        [
                            ...(this.ratelimit.get(
                                `${msg.guild.id}:${msg.author.id}`,
                            ) ?? []),
                            msg.content,
                        ],
                    );
                    return;
                }
                if (
                    !this.ratelimit.has(
                        `${msg.guild.id}:${msg.author.id}`,
                    )
                ) {
                    this.ratelimit.set(
                        `${msg.guild.id}:${msg.author.id}`,
                        [msg.content],
                    );

                    setTimeout(
                        () =>
                            this.ratelimit.delete(
                                `${msg.guild?.id}:${msg.author.id}`,
                            ),

                        1000,
                    );
                }
                if (msg.content === 'USER_WAS_BANNED') return;
                const embed = new Embed()
                    .setColor(0xbc2e29)
                    .setAuthor(msg.author.name, msg.author.avatarUrl)
                    .setThumbnail(msg.author.avatarUrl)
                    .setTimestamp()
                    .setDescription(
                        `Message Deleted in #${msg.channel.name}\n${msg.content ?? '<no content>'}`,
                    );

                if (channel.canMessage && channel.canEmbedLinks) {
                    await channel.createMessage({ embeds: [embed] });
                }
            }
        }
    }
}
