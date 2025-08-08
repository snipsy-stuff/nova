import {
    Interaction,
    InteractionEditOrRespond,
} from 'detritus-client/lib/structures';
import {
    InteractionCommand,
    InteractionCommandOption,
    InteractionContext,
    ParsedArgs,
} from 'detritus-client/lib/interaction';
import { InteractionCommandClient } from 'detritus-client';
import {
    MessageFlags,
    Permissions,
} from 'detritus-client/lib/constants';
import { emotes } from '@nova/util/emote';
import { NovaShardClient } from '@nova/core/client/ShardClient';
export class CustomContext<
    Args extends ParsedArgs,
> extends InteractionContext {
    public args: Args;
    declare client: NovaShardClient;
    constructor(
        interactionCommandClient: InteractionCommandClient,
        interaction: Interaction,
        command: InteractionCommand,
        invoker: InteractionCommand | InteractionCommandOption,
        args: Args,
    ) {
        super(
            interactionCommandClient,
            interaction,
            command,
            invoker,
        );
        this.args = args;
    }

    emote(emote: keyof (typeof emotes)['custom']) {
        // handle user-install by just returning default emote
        if (!this.guild && !this.inDm) {
            return emotes.default[emote];
        }
        if (!this.guild && !this.inDm) return emotes.custom[emote];
        if (this.me?.can(Permissions.USE_EXTERNAL_EMOJIS)) {
            return emotes.custom[emote];
        }
        return emotes.default[emote];
    }

    async error(error?: string) {
        return this.say(
            `${this.emote('error')} failed to run the command. ${error || ''}`,
            {
                flags: 64,
            },
        );
    }

    async display(components: { content: string }[]) {
        return this.send({
            flags: MessageFlags.IS_COMPONENTS_V2,
            components: [
                {
                    type: 9,
                    components: components.map((c) => ({
                        type: 10,
                        content: c.content,
                    })),
                },
            ],
        });
    }

    async say(content: string, options?: InteractionEditOrRespond) {
        return this.send({
            ...options,
            content,
        });
    }

    async send(options: InteractionEditOrRespond) {
        return this.editOrRespond(options);
    }

    static fromContext(
        context: InteractionContext,
        args: ParsedArgs,
    ) {
        return new CustomContext(
            context.interactionCommandClient,
            context.interaction,
            context.command,
            context.invoker,
            args,
        );
    }

    get economy() {
        return this.client.games.economy;
    }
}

export type Context = CustomContext<Record<'', undefined>>;
