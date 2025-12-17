import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';
import { inspect } from 'util';

@CustomListener.applyOptions({
    emitter: 'client',
    event: CustomListener.eventNames.VOICE_STATE_UPDATE,
    id: 'voice.state.update',
    type: 'on',
    enabled: true,
})
export default class VoiceChanelJoinEvent extends CustomListener {
    async run(data: GatewayClientEvents.VoiceStateUpdate) {
        const action = data.joinedChannel
            ? 'joined'
            : data.leftChannel
              ? 'left'
              : null;
        console.log(action);
        if (!action) return null;
        if (!data.voiceState.guild) return;
        if (action === 'left') {
            console.log(
                inspect(data, { depth: 2, showHidden: true }),
            );
            const voiceState = data.old;
            if (!voiceState) return;
            if (!voiceState.guild) return;
            if (!voiceState.channelId) return;
            const voiceChannel =
                voiceState.channel ||
                voiceState.guild.channels.get(voiceState.channelId);
            if (!voiceChannel) return;
            if (!voiceChannel) return;

            const guild = voiceState.guild;
            const member =
                voiceState.member ||
                guild.members.get(voiceState.userId) ||
                (await guild.fetchMember(voiceState.userId));
            if (!member) return;
            const collection = this.client.db.guilds;

            if (voiceState.guild) {
                const settings = await collection.findOne({
                    guildId: voiceState.guild.id,
                });
                if (settings?.mod_log) {
                    if (!settings.mod_log.enabled) return;
                    if (!settings.mod_log.members) return;
                    if (!settings.mod_log.channel) return;

                    const channel = voiceState.guild.channels.get(
                        settings.mod_log.channel,
                    ) as ChannelGuildText;
                    if (!channel) return;

                    const embed = new Embed()
                        .setColor(0xbc2e29)
                        .setTimestamp()
                        .setThumbnail(
                            voiceState.member?.avatarUrl ?? '',
                        )
                        .setAuthor(member.name, member.avatarUrl)
                        .setDescription(
                            `${action} Voice channel #${voiceChannel.name}`,
                        );

                    if (channel.canMessage && channel.canEmbedLinks) {
                        await channel.createMessage({
                            embeds: [embed],
                        });
                    }
                }
            }

            // -- end --
        }
        if (!action) return null;

        if (!action) return null;
        if (!data.voiceState.guild) return;
        if (!data.voiceState.channelId) return;

        const voiceChannel =
            data.voiceState.channel ||
            data.voiceState.guild.channels.get(
                data.voiceState.channelId,
            );

        if (!voiceChannel) return;

        const guild = data.voiceState.guild;
        const member =
            data.voiceState.member ||
            guild.members.get(data.voiceState.userId) ||
            (await guild.fetchMember(data.voiceState.userId));
        if (!member) return;
        const collection = this.client.db.guilds;

        if (data.voiceState.guild) {
            const settings = await collection.findOne({
                guildId: data.voiceState.guild.id,
            });
            if (settings?.mod_log) {
                if (!settings.mod_log.enabled) return;
                if (!settings.mod_log.members) return;
                if (!settings.mod_log.channel) return;

                const channel = data.voiceState.guild.channels.get(
                    settings.mod_log.channel,
                ) as ChannelGuildText;
                if (!channel) return;

                const embed = new Embed()
                    .setColor(0x57f287)
                    .setTimestamp()
                    .setThumbnail(
                        data.voiceState.member?.avatarUrl ?? '',
                    )
                    .setAuthor(member.name, member.avatarUrl)
                    .setDescription(
                        `${action} Voice channel #${voiceChannel.name}`,
                    );

                if (channel.canMessage && channel.canEmbedLinks) {
                    await channel.createMessage({ embeds: [embed] });
                }
            }
        }
    }
}
