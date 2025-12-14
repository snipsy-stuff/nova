import { GuildContext } from '@nova/commands/CustomInteractionContext';
import { BooleanOption } from '@nova/commands/options/BooleanOption';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { defaultSettings } from '@nova/util/Constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';

@SubCommand.applyOptions({
    name: 'modlog',
    description: 'Set up mod log related information',
    options: [
        new BooleanOption()
            .setName('enable')
            .setDescription(
                'wether you want to enable/disable the modlog',
            ),
        new TextChannelOption()
            .setName('channel')
            .setDescription(
                'the channel the bot will send the modlog to',
            ),
        new BooleanOption()
            .setName('channels')
            .setDescription('wether you want to log channels'),
        new BooleanOption()
            .setName('emojis')
            .setDescription('wether you want to log emojis'),
        new BooleanOption()
            .setName('invites')
            .setDescription('wether you want to log invites'),
        new BooleanOption()
            .setName('members')
            .setDescription('wether you want to log members'),
        new BooleanOption()
            .setName('messages')
            .setDescription('wether you want to log messages'),
        new BooleanOption()
            .setName('mod_actions')
            .setDescription('wether you want to log mod_actions'),
        new BooleanOption()
            .setName('reactions')
            .setDescription('wether you want to log reactions'),
        new BooleanOption()
            .setName('roles')
            .setDescription('wether you want to log roles'),
        new BooleanOption()
            .setName('stickers')
            .setDescription('wether you want to log stickers'),
    ],
})
export class ModlogSubCommand extends SubCommand {
    async exec(ctx: GuildContext<Partial<Option>>) {
        let existing = await ctx.client.db.guilds.findOne({
            guildId: ctx.guildId,
        });

        if (!existing || !existing.mod_log) {
            //@ts-expect-error You do not need the id.
            existing = {
                ...defaultSettings,
                mod_log: {
                    ...defaultSettings.mod_log,
                    enabled:
                        (defaultSettings.mod_log?.enabled ??
                            ctx.args.enabled) ||
                        false,
                    channel:
                        (defaultSettings.mod_log?.channel ??
                            ctx.args.channel?.id) ||
                        '',
                    channels:
                        (defaultSettings.mod_log?.channels ??
                            ctx.args.channels) ||
                        false,
                    emojis:
                        (defaultSettings.mod_log?.emojis ??
                            ctx.args.emojis) ||
                        false,
                    invites:
                        (defaultSettings.mod_log?.invites ??
                            ctx.args.invites) ||
                        false,
                    members:
                        (defaultSettings.mod_log?.members ??
                            ctx.args.members) ||
                        false,
                    messages:
                        (defaultSettings.mod_log?.messages ??
                            ctx.args.messages) ||
                        false,
                    mod_actions:
                        (defaultSettings.mod_log?.mod_actions ??
                            ctx.args.mod_actions) ||
                        false,
                    reactions:
                        (defaultSettings.mod_log?.reactions ??
                            ctx.args.reactions) ||
                        false,
                    roles:
                        (defaultSettings.mod_log?.roles ??
                            ctx.args.roles) ||
                        false,
                    stickers:
                        (defaultSettings.mod_log?.stickers ??
                            ctx.args.stickers) ||
                        false,
                },
            };
            await ctx.client.db.guilds.insertOne({
                ...existing,
                guildId: ctx.guild.id,
            });
            return ctx.say(
                `${ctx.emote('success')} created modlog settings according to your input`,
                { flags: 64 },
            );
        } else {
            existing.mod_log = {
                ...existing.mod_log,
                enabled:
                    ctx.args.enabled ?? existing.mod_log?.enabled,
                channel:
                    ctx.args.channel?.id ?? existing.mod_log?.channel,
                channels:
                    ctx.args.channels ?? existing.mod_log?.channels,
                emojis: ctx.args.emojis ?? existing.mod_log?.emojis,
                invites:
                    ctx.args.invites ?? existing.mod_log?.invites,
                members:
                    ctx.args.members ?? existing.mod_log?.members,
                messages:
                    ctx.args.messages ?? existing.mod_log?.messages,
                mod_actions:
                    ctx.args.mod_actions ??
                    existing.mod_log?.mod_actions,
                reactions:
                    ctx.args.reactions ?? existing.mod_log?.reactions,
                roles: ctx.args.roles ?? existing.mod_log?.roles,
                stickers:
                    ctx.args.stickers ?? existing.mod_log?.stickers,
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
            `${ctx.emote('info')} Updated modlog settings.`,
            {
                flags: 64,
            },
        );
    }
}

interface Option {
    enabled: boolean;
    channel: ChannelGuildText;
    channels: boolean;
    emojis: boolean;
    invites: boolean;
    members: boolean;
    messages: boolean;
    mod_actions: boolean;
    reactions: boolean;
    roles: boolean;
    stickers: boolean;
}
