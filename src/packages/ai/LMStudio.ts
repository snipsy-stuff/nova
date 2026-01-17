import { parseEnv } from '@nova/util/env';
import { User } from 'detritus-client/lib/structures';
import * as openai from 'openai';
export class LmStudio {
    models = {
        chatgpt: 'chatgpt',
        gpt4: 'gpt-oss-20b',
        mistral: 'mistral@7b',
        qwen2: 'deep-seek-r1@1.5b',
        lama: 'lama@1b',
        gemma3: 'gemma3@4b',
    } as const;

    openai = new openai.OpenAI({ apiKey: parseEnv().OPENAI_KEY });

    async request(content: string[]) {
        const NAME = 'GAIA';
        const body = {
            model: this.models.lama,
            stream: false,
            response_format: {
                type: 'text',
            },
            messages: [
                {
                    role: 'system',
                    content: [
                        `IMPORTANT: You will only respond as "${NAME}" not as someone else`,
                        'your name is Nova. you are a human that plays a Supportive Artificial floating brain from the Horizon: Forbidden West games',
                        'you will respond in a human-like tone.',
                        'Please pretent to be part of the Party.',
                        'Please only respond as yourself, not other characters. what would you do?',
                    ].join('\n'),
                },
                {
                    role: 'user',
                    content: content.join('\n'),
                },
            ],
        };

        const resp = await fetch(
            `http://lmstudio.local:1234/v1/chat/completions`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            },
        );
        if (resp.ok) {
            const data2 = await resp.json();
            console.log(data2);
            return data2.choices[0].message.content
                .replace(/Nova\:/, '')
                .split('%%%%');
        } else {
            const res = await resp.json();
            console.log(res.error);
            throw new Error(res.error);
        }
    }

    async chat(
        model: ValueOf<LmStudio['models']>,
        input: string,
        user: User,
    ) {
        const sass = Math.floor(Math.random() * 20000) === 1500;
        if (model === 'chatgpt') {
            return this.openai.responses
                .create({
                    model: 'gpt-5',
                    stream: false,
                    input: [
                        {
                            role: 'system',
                            content: `
Avoid robotic phrasing, try to speak like a human being.
Your main task will be to answer questions related to Pathfinder 1E and realted 3rd party content.
Please format the response so it is only using Discord's markdown as formatting.${sass ? 'make it a sassy response towards ' + user.name : ''}
`,
                        },
                        {
                            role: 'user',
                            content: input,
                        },
                    ],
                })
                .then((res) => res.output_text);
        }
        const body = {
            model: model,
            stream: false,
            response_format: {
                type: 'text',
            },
            messages: [
                {
                    role: 'system',
                    content: `
Avoid robotic phrasing, try to speak like a human being.
Your main task will be to answer questions related to Pathfinder 1E and realted 3rd party content.
Please format the response so it is only using Discord's markdown as formatting.${sass ? 'make it a sassy response towards ' + user.name : ''}
`,
                },
                {
                    role: 'user',
                    content: input,
                },
            ],
        };

        const data = await fetch(
            'http://192.168.1.112:1234/v1/chat/completions',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            },
        );

        if (data.ok) {
            const data2 = await data.json();
            console.log(data2);
            return data2.choices[0].message.content.split('%%%%');
        } else {
            const res = await data.json();
            throw new Error(res.error);
        }
    }
}
type ValueOf<T> = T[keyof T];
