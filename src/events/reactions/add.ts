import { CustomListener } from '@nova/listeners/CustomListener';
import { GuildSetings } from '@nova/typings/db/guilds';
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
        const settings = await this.client.db
            .collection<GuildSetings>('guild_settings')
            .findOne({ guildId: data.guildId });
        if (!settings?.starboard?.enabled) return;

        const hit = settings.starboard.emojis.find(
            (em) => data.reaction.emoji.id === em.id,
        );

        if (hit) {
            const count = data.reaction.count;

            if (count >= hit.count) {
                const channel = (this.client.channels.get(
                    settings.starboard.channel,
                ) ||
                    (await this.client.rest.fetchChannel(
                        settings.starboard.channel,
                    ))) as ChannelGuildText;
                if (!channel) return;
                if (!channel.canMessage && channel.canEmbedLinks)
                    return;
                const embed = new Embed();
                embed
                    .setAuthor(user.name, user.avatarUrl)
                    .setFooter(`#${msg.channel.name}`)
                    .setTimestamp()
                    .setDescription(
                        `<${data.reaction.emoji.animated ? 'a:' : ''}${data.reaction.emoji.name}:${data.reaction.emoji.id}> **${count}** [link](${msg.jumpLink})\n${msg.content.slice(0, 2000)}${msg.content.length >= 2000 ? '...' : ''}`,
                    );
            }
        }
    }
}
