import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { GuildContext } from '@nova/commands/CustomInteractionContext';
import { GuildSetings } from '@nova/typings/db/guilds';
import { NumberOption } from '@nova/commands/options/NumberOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';

@SubCommand.applyOptions({
    name: 'starboard',
    description: 'setup sa reaction triggered starboard',
    options: [
        new TextChannelOption().setName('channel'),
        new AutoComplete()
            .setName('emoji-name')
            .setDescription('the emoji you want to use ')
            .addAutoComplete((ctx) => {
                if (!ctx.guild) {
                    return ctx.respond({ choices: [] });
                }
                if (!ctx.value) {
                    return ctx.respond({
                        choices: ctx.guild?.emojis.map((em) => ({
                            name: em.name,
                            value: em.id || em.name,
                        })),
                    });
                } else {
                    return ctx.respond({
                        choices: ctx.guild?.emojis
                            .filter(
                                (em) =>
                                    em.name.toLowerCase() ===
                                    ctx.value.toLowerCase(),
                            )
                            .map((em) => ({
                                name: em.name,
                                value: em.id || em.name,
                            })),
                    });
                }
            }),
        new NumberOption()
            .setName('count')
            .setDescription(
                'how many reactions must be done to count',
            ),
    ],
})
export class StarboardSetupCommand extends SubCommand {
    async exec(
        ctx: GuildContext<{
            channel: ChannelGuildText;
            emoji: string;
            count: number;
        }>,
    ) {
        const collection =
            ctx.client.db.collection<GuildSetings>('guild_settings');
        const existing = await collection.findOne({
            guildId: ctx.guildId,
        });
        if (!existing) {
            await collection.insertOne({
                guildId: ctx.guild.id,
                starboard: {
                    enabled: true,
                    channel: ctx.args.channel.id,
                    messages: [],
                    emojis: [
                        {
                            count: ctx.args.count || 2,
                            id: ctx.args.emoji,
                        },
                    ],
                },
            });
            return ctx.say('created starboard.', { flags: 64 });
        }

        existing?.starboard.emojis.push({
            count: ctx.args.count,
            id: ctx.args.emoji,
        });
        await collection.updateOne(
            {
                guildId: ctx.guildId,
            },
            {
                $set: {
                    starboard: {
                        enabled: true,
                        channel: ctx.args.channel.id,
                        messages: existing.starboard.messages,
                        emojis: existing?.starboard.emojis,
                    },
                },
            },
        );
        return ctx.say(
            `successfully created the starboard in ${ctx.channel}.`,
            { flags: 64 },
        );
    }

    // async setupModlog(
    //     guild: GuildContext<Record<string, undefined>>['guild'],
    // ) {}
}
