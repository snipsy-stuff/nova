import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { MessageComponentButtonStyles } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import {
    ComponentActionRow,
    ComponentButton,
    Embed,
} from 'detritus-client/lib/utils';
import {
    codestring,
    timestamp,
} from 'detritus-client/lib/utils/markup';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GUILD_MEMBER_ADD,
    emitter: 'client',
    id: 'guild.members.add',
    type: 'on',
    enabled: true,
})
export default class GuildMemberAdd extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberAdd) {
        if (data.isDuplicate) {
            console.log(`duplicated member`);
        }
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

        if (data.isDuplicate) {
            embed.setFooter('is duplicate.');
        }

        embed
            .setAuthor(
                `${member.name}`,
                member.avatarUrlFormat('png'),
            )

            .setTimestamp(Date.now())

            .setDescription(
                [
                    `**Account created**: ${timestamp(member.user.createdAt)}`,
                    `**Names**:${member.names.map((name) => codestring(name)).join(', ')}`,
                ].join('\n'),
            )
            .setThumbnail(member.avatarUrl);

        const channel = guild.channels.get(
            settings.mod_log.channel,
        ) as ChannelGuildText;

        await channel.createMessage({
            embeds: [embed],
            // components: [actions],
        });
    }
}
