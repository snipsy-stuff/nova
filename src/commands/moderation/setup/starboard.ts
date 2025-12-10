import { CustomCommand } from '@nova/commands/CustomCommand';
import {
    // CustomContext,
    GuildContext,
} from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { ChannelOption } from '@nova/commands/options/channels/BaseChannel';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';
import { NumberOption } from '@nova/commands/options/NumberOption';
import { StringOption } from '@nova/commands/options/StringOption';
import { GuildSetings } from '@nova/typings/db/guilds';
import { colorizeText } from '@nova/util/Util';
import { ChannelTypes } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
// import { ComponentActionRow } from 'detritus-client/lib/structures';
import {
    ComponentTextDisplay,
    ComponentActionRow,
    ComponentButton,
} from 'detritus-client/lib/utils';
import { bold } from 'detritus-client/lib/utils/markup';
import { RootCommand } from 'packages/commands/RootCommand';
@RootCommand.requirePermission(['MANAGE_GUILD'])
@RootCommand.applyOptions({
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
export default class SetupCommand extends CustomCommand {
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
        const data = await collection.updateOne(
            {
                guildId: ctx.guildId,
            },
            {
                $set: {
                    starboard: {
                        enabled: true,
                        channel: ctx.args.channel.id,
                        emojis: existing?.starboard.emojis,
                    },
                },
            },
        );
    }

    // async setupModlog(
    //     guild: GuildContext<Record<string, undefined>>['guild'],
    // ) {}
}
