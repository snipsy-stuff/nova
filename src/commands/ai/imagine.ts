import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import * as env from '@nova/util/env';
import { generateRandomBase64 } from '@nova/util/Util';
import { writeFile } from 'fs/promises';
import OpenAI from 'openai';

type model =
    | 'gpt-image-1.5'
    | 'dall-e-2'
    | 'dall-e-3'
    | 'gpt-image-1'
    | 'gpt-image-1-mini';
const models: Record<model, model> = {
    'gpt-image-1.5': 'gpt-image-1.5',
    'dall-e-2': 'dall-e-2',
    'dall-e-3': 'dall-e-3',
    'gpt-image-1': 'gpt-image-1',
    'gpt-image-1-mini': 'gpt-image-1-mini',
};

@CustomCommand.trustedOnly()
@CustomCommand.applyOptions({
    name: 'imagine',
    description: 'create images with ai',
    nsfw: true,
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
    disabled = false;
    async exec(
        ctx: CustomContext<{
            model: ValueOf<typeof models>;
            text: string;
        }>,
    ) {
        const model = models[ctx.args.model] || 'dall-e-3';
        if (this.disabled) return ctx.error('command disabled.');
        await ctx.ephemeral(ctx.emote('loading') + ' creating...');
        const ai = new OpenAI({
            apiKey: env.parseEnv().OPENAI_KEY,
        });
        const options = ['dall-e-2', 'dall-e-3'].includes(model)
            ? undefined
            : ({
                  moderation: 'low',
                  output_format: 'png',
                  quality: 'medium',
              } as const);
        const data = await ai.images.generate({
            prompt: ctx.args.text,
            model,
            user: ctx.user.id,
            ...options,
        });

        if (!options && data.data?.[0].url) {
            const fetched = await fetch(data.data[0].url);
            if (!fetched.ok)
                return ctx.error('failed to create image.');
            const img = Buffer.from(await fetched.arrayBuffer());
            await writeFile(
                `./data/generated_images/${ctx.user.id}_${generateRandomBase64(5)}_img.png`,
                img,
            );
            return ctx.ephemeral(
                `Done! here is your image: (deleting this message will delete the image)`,
                {
                    files: [{ value: img, filename: 'img.png' }],
                },
            );
        }

        if (data.data && data.data[0].b64_json) {
            const img = Buffer.from(data.data[0].b64_json, 'base64');
            await writeFile(
                `./data/generated_images/${ctx.user.id}_${generateRandomBase64(5)}_img.png`,
                img,
            );
            return ctx.ephemeral(
                `Done! here is your image: (deleting this message will delete the image)`,
                {
                    files: [{ value: img, filename: 'img.png' }],
                },
            );
        } else {
            console.log(data);
            return ctx.error(
                'failed to generate image for unknown reasons.',
            );
        }
    }
}
type ValueOf<T> = T[keyof T];
