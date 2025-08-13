import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import { LmStudio } from 'packages/ai/LMStudio';
const models = {
    gpt4: 'openai/gpt-oss-20b',
    mistral: 'mistral@7b',
    qwen2: 'deep-seek-r1@1.5B',
    lama: 'lama@1b',
    gemma3: 'gemma3@4b',
} as const;
@CustomCommand.applyOptions({
    name: 'chat',
    description: 'chat with an ai.',
    options: [
        new StringOption()
            .setName('model')
            .setChoices(
                Object.entries(models).map((model) => ({
                    name: model[0],
                    value: model[1],
                })),
            )
            .setDescription('model to choose.'),
        new StringOption()
            .setName('text')
            .setDescription('the text to ask'),
    ],
})
export default class AIChatCommand extends CustomCommand {
    async exec(
        ctx: CustomContext<{
            model: ValueOf<typeof models>;
            text: string;
        }>,
    ) {
        const dice = ctx.args.model;

        const ai = new LmStudio();
        await ctx.say('thinking...', { flags: 64 });
        const data = await ai.chat(dice, ctx.args.text, ctx.user);
        console.log(
            `${ctx.user.username} requested to know: ${ctx.args.text}`,
        );
        console.log(`resukt; ${data}`);
        console.log(typeof data, data.length);
        const response = data[data.length - 1] || data[0];
        return ctx.say(response.replaceAll('%', ''), { flags: 64 });
    }
}
type ValueOf<T> = T[keyof T];
