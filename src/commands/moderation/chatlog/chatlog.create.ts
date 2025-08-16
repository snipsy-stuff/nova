import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { setTimeout } from 'timers/promises';

@SubCommand.applyOptions({
    name: 'create',
    description: 'creates the chatlog.',
    options: [
        new TextChannelOption()
            .setName('channel')
            .setDescription(
                'the optional channel you want to back up.',
            ),
    ],
})
export class ChatlogCreateCommand extends SubCommand {
    async exec(ctx: CustomContext<{ channel?: ChannelGuildText }>) {
        const toStore: MessageData[] = [];

        const channel = ctx.args.channel ?? ctx.channel ?? undefined;
        if (!ctx.guild)
            return ctx.error(
                `This Server does not appear to have me added. If this is appears to be a mistake, please re-invite me.`,
            );
        if (!channel) {
            return ctx.error('channel does not seem to exist.');
        }
        await ctx.say(`fetching ${channel.mention} ...`);
        let batched = true;
        let before: string | undefined;
        let i = 0;
        while (batched) {
            const fetchedMessages = await ctx.rest
                .fetchMessages(channel.id, {
                    limit: 100,
                    before,
                })
                .then((v) => v.toArray());
            if (!fetchedMessages.length) {
                batched = false;
                break;
            }
            for (const fetchedMessage of fetchedMessages) {
                toStore.push({
                    id: fetchedMessage.id,
                    author: fetchedMessage.author.name,
                    content:
                        fetchedMessage.content || '*[embed or file]*',
                    created: fetchedMessage.createdAt,
                    webhook: fetchedMessage.webhookId !== undefined,
                });
            }
            before = fetchedMessages[fetchedMessages.length - 1].id;

            await ctx.say(
                `fetching ${channel.mention} ...\nBatch ${i + 1}/X`,
            );
            await setTimeout(500);
            i++;
        }
        const local = ctx.locale || ctx.guildLocale || 'en-US';
        return ctx.success(
            `success! saved ${toStore.length} messages from ${channel}.`,
            {
                flags: 64,
                files: [
                    {
                        value: Buffer.from(
                            toStore
                                .reverse()
                                .map(
                                    (data) =>
                                        `[${data.created.toLocaleString(local)}] ${data.author}: ${data.content}`,
                                )
                                .join('\n'),
                        ),
                        filename: 'output.md',
                    },
                ],
            },
        );
    }
}

interface MessageData {
    id: string;
    content: string;
    author: string;
    created: Date;
    webhook: boolean;
}
