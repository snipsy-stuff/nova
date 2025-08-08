import { User } from 'detritus-client/lib/structures';
export class LmStudio {
    models = {
        gpt4: 'openai/gpt-oss-20b',
        mistral: 'mistral@7b',
        qwen2: 'deep-seek-r1@1.5B',
        lama: 'lama@1b',
        gemma3: 'gemma3@4b',
    } as const;

    async chat(
        model: ValueOf<LmStudio['models']>,
        input: string,
        user: User,
    ) {
        const body = {
            model: model,
            stream: false,
            messages: [
                {
                    role: 'system',
                    content: `
Your name is Nova, and the requesting user's name is ${user.name === 'cosmicprincess' ? 'cutie' : user.name}.
Speak with a natural, human-like tone.
Avoid robotic phrasing.
- Mention the user with the Username OR with a 99% chance give them a cute nickname.
Rules:

- Do not explain intentions, actions, or the prompt itself.
- Do not reference that you are an AI model.
- Do not say "Need to comply" or similar phrases.
- Do not say "User asked for..." or "Here’s the info…"
- Respond with the answer only, in a natural conversational way.
- Do not include filler or commentary unless requested.
- Treat each input as if speaking directly with the user in a fluid, human tone.
- Do not say something like "Need to give info about Pathfinder 1E normal standard sword. Provide stats." or similar things at the beginning.
- conclude your own prompt in the beginning and divide it with the response using %%%%%. 
Response to the user's request MUST begin with %%%% 
Total response should stay below 2000 Characters, cut appropriately before.
`,
                },
                {
                    role: 'user',
                    content: input,
                },
            ],
        };
        const data = await fetch(
            'http://192.168.56.1:1234/v1/chat/completions',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            },
        );
        if (data.ok) {
            const data2 = await data.json();
            return data2.choices[0].message.content.split('%%%%');
        } else {
            const res = await data.json();
            console.log(res);
            throw new Error(res.error);
        }
    }
}
type ValueOf<T> = T[keyof T];
