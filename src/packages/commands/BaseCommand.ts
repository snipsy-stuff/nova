import { NovaShardClient } from '@nova/core/client/ShardClient';
import { owners } from '@nova/util/Constants';
import { Constants, Interaction } from 'detritus-client';
import { CustomCommand } from './CustomCommand';
import { CustomContext } from './CustomInteractionContext';
import { ParsedArgs } from 'detritus-client/lib/interaction';

export class BaseCommand extends Interaction.InteractionCommand {
    disabled = false;
    requireSpecialPermission = false;
    onBefore(
        context: Interaction.InteractionContext,
    ): Promise<boolean> | boolean {
        const client = context.client as NovaShardClient;
        client.logger.log(
            `[COMMAND_RUN] ${context.user.name} running command ${this.name}`,
        );
        client.stats.commands++;
        return true;
    }

    static applyOptions(
        options: Interaction.InteractionCommandOptions,
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return function <
            T extends new (...args: unknown[]) => object,
        >(constructor: T): T {
            //@ts-expect-error Typescript does not like your mom
            return class T extends constructor {
                constructor(
                    old_options: Interaction.InteractionCommandOptions,
                ) {
                    super({
                        ...old_options,
                        ...options,
                    });
                }
            };
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static ownerOnly(): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (constructor: any) => {
            return class T extends constructor {
                requireSpecialPermission = true;
                onBeforeRun(
                    context: Interaction.InteractionContext,
                    //args: Interaction.ParsedArgs,
                ) {
                    return owners.includes(context.userId);
                }
            };
        };
    }

    static applyMetaData(metadata: Record<string, unknown>) {
        return function <T extends typeof CustomCommand>(
            constructor: T,
        ) {
            //@ts-expect-error we know TS. We KNOW
            return class extends constructor {
                metadata = metadata;
            };
        };
    }

    static requirePermission(
        permission:
            | keyof typeof Constants.Permissions
            | (keyof typeof Constants.Permissions)[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        return function <T extends typeof CustomCommand>(
            constructor: T,
        ) {
            //@ts-expect-error we know TS. We KNOW
            return class extends constructor {
                requireSpecialPermission = true;
                onBeforeRun(
                    context: Interaction.InteractionContext,
                    args: ParsedArgs,
                ) {
                    const ctx = CustomContext.fromContext(
                        context,
                        args,
                    );
                    const member = ctx.member;
                    if (!member) return false;
                    const required = Array.isArray(permission)
                        ? permission.map(
                              (p) => Constants.Permissions[p],
                          )
                        : Constants.Permissions[permission];
                    if (Array.isArray(required)) {
                        return required.every(
                            (permission) =>
                                (member.permissions & permission) ===
                                permission,
                        );
                    }
                    return (
                        (member.permissions & required) === required
                    );
                }
            };
        };
    }
}
