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
export default class GuildChannelUPDATE extends CustomListener {
    async run(data: GatewayClientEvents.GuildMemberAdd) {
        const member = data.member;

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
            .setDescription(
                [
                    `**Account created**: ${timestamp(member.user.createdAt)}`,
                    `**Names**:${member.names.map((name) => codestring(name)).join(', ')}`,
                ].join('\n'),
            )
            .setThumbnail(member.avatarUrl);

        const channel = this.client.channels.get(
            '1385968836662267997',
        ) as ChannelGuildText;

        await channel.createMessage({
            embeds: [embed],
            components: [actions],
        });
    }
}
