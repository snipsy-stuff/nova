import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { TextChannelOption } from '@nova/commands/options/channels/TextChannelOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { parseEnv } from '@nova/util/env';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { setTimeout } from 'timers/promises';

@SubCommand.applyOptions({
    name: 'create',
    description: 'creates the chatlog.',
    permissions: [1n << 13n],
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

        await ctx.say('please ignore this message', { flags: 64 });
        const channel = ctx.args.channel ?? ctx.channel ?? undefined;
        if (!ctx.guild)
            return ctx.error(
                `This Server does not appear to have me added. If this is appears to be a mistake, please re-invite me.`,
            );
        if (!channel) {
            return ctx.error('channel does not seem to exist.');
        }
        const message = await (
            ctx.channel as ChannelGuildText
        ).createMessage(`fetching ${channel.mention} ...`);
        let batched = true;
        let before: string | undefined;
        let i = 0;
        const local = ctx.locale || ctx.guildLocale || 'en-US';
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
            await setTimeout(500);
            await message
                .edit(
                    `Fetching ${channel}...\nBatch ${i + 1}/unknown...${(
                        Buffer.from(
                            toStore
                                .reverse()
                                .map(
                                    (data) =>
                                        `[${data.created.toLocaleString(local)}] ${data.author}: ${data.content}`,
                                )
                                .join('\n'),
                        ).length /
                        1024 /
                        1024
                    ).toFixed(2)} Mb stored.`,
                )
                .catch(console.error);
            i++;
        }

        const stored = toStore
            .reverse()
            .map(
                (data) =>
                    `[${data.created.toLocaleString(local)}] ${data.author}: ${data.content}`,
            )
            .join('\n');

        const resp = await fetch(`https://api.github.com/gists`, {
            method: 'POST',
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${parseEnv().GITHUB_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({
                public: false,
                description: `content of all messages of ${channel.name}`,
                files: {
                    [channel.name.replace(/[^\w.-]/g, '_')]: {
                        content: stored,
                    },
                },
            }),
        });
        if (!resp.ok) {
            console.log('ye');

            console.log(await resp.json());
            return message.edit('idk broke ig.');
        }

        return message.edit(
            `success! saved ${toStore.length} messages from ${channel} here: ${(await resp.json()).html_url}.`,
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
