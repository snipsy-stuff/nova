import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import { LmStudio } from 'packages/ai/LMStudio';

const models = {
    gpt4: 'gpt-oss-20b',
    mistral: 'mistral@7b',
    qwen2: 'deep-seek-r1@1.5b',
    lama: 'lama@1b',
    gemma3: 'gemma3@4b',
} as const;
@CustomCommand.applyOptions({
    name: 'chat',
    description: 'chat with an ai.',

    options: [
        new StringOption()
            .setName('text')
            .setRequired(true)
            .setDescription('the text to ask'),
        new StringOption()
            .setName('model')
            .setChoices(
                Object.entries(models).map((model) => ({
                    name: model[0],
                    value: model[1],
                })),
            )
            .setDescription('model to choose.'),
    ],
})
export default class AIChatCommand extends CustomCommand {
    disabled = true;
    async exec(
        ctx: CustomContext<{
            model: ValueOf<typeof models>;
            text: string;
        }>,
    ) {
        const model = ctx.args.model;

        const ai = new LmStudio();
        await ctx.say('thinking...');
        const data = await ai
            .chat(model, ctx.args.text, ctx.user)
            .catch(() => ['UNREACHABLE']);
        console.log(
            `${ctx.user.username} requested to know: ${ctx.args.text}`,
        );
        const response = data[data.length - 1] || data[0];
        return ctx.send({
            content: response.slice(0, 2000),
            ...(response.length >= 2000
                ? {
                      files: [
                          {
                              filename: 'output.txt',
                              value: Buffer.from(response),
                          },
                      ],
                  }
                : undefined),
        });
    }
}
type ValueOf<T> = T[keyof T];
