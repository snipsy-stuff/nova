import { User } from 'detritus-client/lib/structures';
export class LmStudio {
    models = {
        gpt4: 'gpt-oss-20b',
        mistral: 'mistral@7b',
        qwen2: 'deep-seek-r1@1.5b',
        lama: 'lama@1b',
        gemma3: 'gemma3@4b',
    } as const;

    async chat(
        model: ValueOf<LmStudio['models']>,
        input: string,
        user: User,
    ) {
        const sass = Math.floor(Math.random() * 20000) === 1500;
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
Avoid robotic phrasing.

Your main task will be to answer questions related to Pathfinder 1E and realted 3rd party content.
Please format the response so it is only using Discord's markdown as formatting.${sass ? 'make it a sassy response' : ''}
`,
                },
                {
                    role: 'user',
                    content: input,
                },
            ],
        };

        const data = await fetch(
            'http://192.168.1.111:1234/v1/chat/completions',
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
