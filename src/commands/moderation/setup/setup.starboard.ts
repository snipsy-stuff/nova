import { GuildContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { BooleanOption } from '@nova/commands/options/BooleanOption';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';
import { NumberOption } from '@nova/commands/options/NumberOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { defaultSettings } from '@nova/util/Constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';

@SubCommand.applyOptions({
    name: 'starboard',
    description: 'Set up starboard related information',
    options: [
        new BooleanOption()
            .setName('enable')
            .setDescription(
                'wether you want to enable/disable the starboard',
            ),
        new TextChannelOption()
            .setName('channel')
            .setDescription(
                'the channel the bot will send the "starred" message to',
            ),
        new AutoComplete()
            .setName('emoji')
            .setDescription('what emoji you want to use')
            .addAutoComplete(async (ctx) => {
                if (!ctx.guild) {
                    return ctx.respond({ choices: [] })
                }
                if (!ctx.value) {
                    return ctx.respond({
                        choices: ctx.guild.emojis.map((em) => ({
                            value: em.id,
                            name: em.name
                        })).slice(0, 15)
                    })
                }
                const filterd = ctx.guild.emojis.filter((em) => em.name.toLowerCase().includes(ctx.value.toLowerCase())).map((em) => ({ name: em.animated ? `a_${em.name}` : em.name, value: em.id || em.name })).slice(0, 15)
                return ctx.respond({
                    choices: filterd ?? []
                })
            }),
        new NumberOption().setName('count').setDescription('how many times this emoji must be reacted to a message.'),
        new AutoComplete()
            .setName('react_emoji')
            .setDescription('what emoji you want to use')
            .addAutoComplete(async (ctx) => {
                if (!ctx.guild) {
                    return ctx.respond({ choices: [] })
                }
                if (!ctx.value) {
                    return ctx.respond({
                        choices: ctx.guild.emojis.map((em) => ({
                            value: em.id,
                            name: em.name
                        })).slice(0, 15)
                    })
                }
                const filterd = ctx.guild.emojis.filter((em) => em.name.toLowerCase().includes(ctx.value.toLowerCase())).map((em) => ({ name: em.animated ? `a_${em.name}` : em.name, value: em.id || em.name })).slice(0, 15)
                return ctx.respond({
                    choices: filterd ?? []
                })
            }),

    ],
})
export class StarboardSubCommand extends SubCommand {
    async exec(ctx: GuildContext<Partial<Option>>) {
        let existing = await ctx.client.db.guilds.findOne({
            guildId: ctx.guildId,
        });

        if (!existing || !existing.star_board) {
            //@ts-expect-error You do not need the id.
            existing = {
                ...defaultSettings,
                star_board: {
                    ...defaultSettings.star_board,
                    channel: ctx.args.channel?.id ?? defaultSettings.star_board.channel,
                    emojis: ctx.args.emoji ? [
                        ...defaultSettings.star_board.emojis,
                        {
                            id: ctx.args.emoji,
                            count: ctx.args.count || 3

                        }] : [],
                    enabled: ctx.args.enabled || defaultSettings.star_board.enabled,
                    messages: [],
                    react_emoji: ctx.args.react_emoji || ''

                },
            };
            await ctx.client.db.guilds.insertOne({
                ...existing,
                guildId: ctx.guild.id,
            });
            return ctx.say(
                `${ctx.emote('success')} created starboard settings according to your input`,
                { flags: 64 },
            );
        } else {

            const emojis = existing.star_board.emojis.length && ctx.args.emoji ?

                [
                    ...existing.star_board.emojis,
                    {
                        count: ctx.args.count || 3,
                        id: ctx.args.emoji
                    }

                ] : ctx.args.emoji ? [{ count: ctx.args.count || 3, id: ctx.args.emoji }] : []
            existing.star_board = {
                ...existing.star_board,
                enabled:
                    ctx.args.enabled ?? existing.star_board.enabled,
                channel:
                    ctx.args.channel?.id ?? existing.star_board.channel,
                emojis: emojis,
                messages: [
                    ...existing.star_board.messages,
                ],
                react_emoji: ctx.args.react_emoji || existing.star_board.react_emoji
            };
        }

        await ctx.client.db.guilds.updateOne(
            { guildId: ctx.guildId },
            {
                $set: {
                    ...existing,
                },
            },
        );
        return ctx.say(
            `${ctx.emote('info')} Updated Starboard settings.`,
            {
                flags: 64,
            },
        );
    }
}

interface Option {
    enabled: boolean;
    channel: ChannelGuildText;
    emoji: string;
    count: number;
    react_emoji: string;
}
