import { CustomContext } from '@nova/commands/CustomInteractionContext';

type Status = 'loading' | 'success' | 'error';

export class ProgressList {
    private statuses = new Map<string, Status>();
    private started = false;
    ended = false;

    constructor(
        private readonly ctx: CustomContext<Record<string, unknown>>,
        private readonly emojis = {
            loading: '⏳', // or '<a:loading:...>'
            success: '✅',
            error: '❌',
        },
    ) {}

    add(taskName: string) {
        if (this.ended) return;
        this.statuses.set(taskName, 'loading');
    }

    async start() {
        if (this.ended) return;
        this.started = true;
        // editOrRespond: if we haven't responded yet -> respond; otherwise -> edit
        await this.ctx.editOrRespond({ content: this.render() });
    }

    async set(taskName: string, status: Status) {
        if (this.ended) return;
        this.statuses.set(taskName, status);
        await new Promise((res) => setTimeout(res, 300));
        if (!this.started) {
            // In case you call set() before start(), we still ensure a response exists.
            this.started = true;
            await this.ctx.editOrRespond({ content: this.render() });
            return;
        }

        // edit the *original* interaction response
        await this.ctx.editResponse({ content: this.render() });
    }

    async end() {
        this.ended = true;
        await new Promise((res) => setTimeout(res, 300));
    }

    private render(): string {
        return [...this.statuses.entries()]
            .map(
                ([name, status]) =>
                    `${this.emojis[status]} : ${name}`,
            )
            .join('\n');
    }
}
