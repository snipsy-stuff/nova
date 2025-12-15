import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.MESSAGE_REACTION_REMOVE,
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
                    .setColor(0x57fc41)
                    .setDescription(
                        [
                            `${user.name} remove reaction in <#${data.channelId}>`,
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
    }
}
