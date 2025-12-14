import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import {
    MarkupTimestampStyles,
    MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import {
    ComponentActionRow,
    ComponentButton,
    Embed,
} from 'detritus-client/lib/utils';
import { timestamp } from 'detritus-client/lib/utils/markup';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_MEMBER_REMOVE,
    emitter: 'client',
    id: 'guild.members.remove',
    type: 'on',
    enabled: true,
})
export default class GuildMemberAdd extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberAdd) {
        if (data.isDuplicate) return;
        const member = data.member;
        const settings = await this.client.db.guilds.findOne({
            guildId: data.guildId,
        });

        const guild = this.client.guilds.get(data.guildId);
        if (!guild) return;
        if (!settings) return;
        if (!settings.mod_log?.enabled) return;
        if (!settings.mod_log.members) return;
        const embed = new Embed();

        const actions = new ComponentActionRow();
        actions
            .addButton(
                new ComponentButton()
                    .setDisabled(true)
                    .setStyle(MessageComponentButtonStyles.DANGER)
                    .setCustomId('aflkhafkaf')
                    .setLabel('ban'),
            )
            .addButton(
                new ComponentButton()
                    .setDisabled(true)
                    .setStyle(MessageComponentButtonStyles.DANGER)
                    .setCustomId('aklfhjlafg')
                    .setLabel('kick'),
            );

        embed
            .setAuthor(
                `${member.name}`,
                member.avatarUrlFormat('png'),
            )
            .setTimestamp(Date.now())
            .setColor(0xf45050)
            .setDescription(
                [
                    `@${member.name} has left. joined: ${timestamp(member.joinedAtUnix, MarkupTimestampStyles.RELATIVE)}`,
                ].join('\n'),
            )
            .setThumbnail(member.avatarUrl);

        const channel = guild.channels.get(
            settings.mod_log.channel,
        ) as ChannelGuildText;
        if (!channel || !channel.canMessage || !channel.canEmbedLinks)
            return;

        await channel.createMessage({
            embeds: [embed],
            // components: [actions],
        });
    }
}
