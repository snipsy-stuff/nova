import { CustomListener } from '@nova/listeners/CustomListener';
import { contentTypes } from '@nova/util/Constants';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_REACTION_ADD,
    emitter: 'client',
    id: 'client.reaction.add',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.MessageReactionAdd) {
        const msg =
            data.message ||
            (await this.client.rest.fetchMessage(
                data.channelId,
                data.messageId,
            ));
        const user =
            data.user ||
            (await this.client.rest.fetchUser(data.userId));
        if (user.bot) return;
        if (!data.guildId) return;
        if (!msg.channel) return;
        const settings = await this.client.db.guilds.findOne({
            guildId: data.guildId,
        });
        if (!settings) return;

        if (settings.mod_log) {
            if (
                settings.mod_log.enabled &&
                settings.mod_log.reactions
            ) {
                const embed = new Embed()
                    .setColor(0x57f287)
                    .setDescription(
                        [
                            `${user.name} reacted in <#${data.channelId}>`,
                            `-# Message by @${msg.author.name}`,
                            '',
                            `Reaction Emoji: ${data.reaction.emoji.format} `,
                        ].join('\n'),
                    );
                const channel = (this.client.channels.get(
                    settings.mod_log.channel,
                ) ||
                    (await this.client.rest.fetchChannel(
                        settings.mod_log.channel,
                    ))) as ChannelGuildText;
                if (!channel) return;
                if (!channel.canMessage && channel.canEmbedLinks)
                    return;
                await channel.createMessage({ embeds: [embed] });
            }
        }
        if (settings.star_board) {
            if (settings.star_board.channel === data.channelId)
                return;
            const hit = settings.star_board.emojis.find(
                (em) => data.reaction.emoji.id === em.id,
            );
            if (hit) {
                if (!settings.star_board.messages) {
                    settings.star_board.messages = [];
                }
                settings.star_board.messages.push(data.messageId);
                if (data.messageAuthorId === data.userId) return;
                const count = data.reaction.count;
                console.log(`message was reacted.`);
                if (count >= hit.count) {
                    const channel = (this.client.channels.get(
                        settings.star_board.channel,
                    ) ||
                        (await this.client.rest.fetchChannel(
                            settings.star_board.channel,
                        ))) as ChannelGuildText;
                    if (!channel) return;
                    if (!channel.canMessage && channel.canEmbedLinks)
                        return;
                    console.log(msg.embeds);

                    const content = msg.content.length
                        ? msg.content.length >= 2000
                            ? msg.content.slice(0, 2000) + '...'
                            : ''
                        : msg.attachments.length
                          ? `[no content. ${msg.attachments.length} attachments]`
                          : msg.embeds.length
                            ? `[no content. ${msg.embeds.length} embeds]`
                            : msg.stickers.length
                              ? `Send a sticker: ${msg.stickers.first()?.name}`
                              : '[unknown content]';
                    const embed = new Embed();
                    let img: Buffer | undefined;
                    let t: string | undefined;
                    if (msg.attachments.length) {
                        const first = msg.attachments.first();
                        if (first?.contentType) {
                            if (
                                contentTypes.images.includes(
                                    first.contentType,
                                ) &&
                                first.isImage
                            ) {
                                img = Buffer.from(
                                    await (
                                        await fetch(first.proxyUrl)
                                    ).arrayBuffer(),
                                );
                                if (first.contentType === 'image/gif')
                                    t = 'gif';
                                else t = 'png';
                                embed.setImage(
                                    `Attachment://image.${t}`,
                                );
                            }
                        }
                    }
                    embed
                        .setAuthor(
                            msg.author.name,
                            msg.author.avatarUrl,
                        )
                        .setFooter(`#${msg.channel.name}`)
                        .setColor(0xcdccff)

                        .setTimestamp()
                        .setDescription(
                            `<${
                                data.reaction.emoji.animated
                                    ? 'a:'
                                    : ''
                            }${data.reaction.emoji.name}:${data.reaction.emoji.id}> **${count}** [link](${msg.jumpLink})\n${content}`,
                        );

                    await channel.createMessage({
                        embeds: [embed],
                        files:
                            img && t
                                ? [
                                      {
                                          filename: `image.${t}`,
                                          value: img,
                                      },
                                  ]
                                : undefined,
                    });
                    if (data.message?.canReact) {
                        await data.message.react(
                            settings.star_board.react_emoji,
                        );
                    }
                    await this.client.db.guilds.updateOne(
                        { guildId: data.guildId },
                        {
                            $set: {
                                ...settings,
                            },
                        },
                    );
                }
            }
        }
    }
}
