import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
@CustomCommand.applyOptions({
    name: 'help',

    description: 'help!!!.',
})
export default class PingCommand extends CustomCommand {
    exec(
        ctx: CustomContext<Record<string, unknown>>,
    ): Promise<unknown> {
        const commands = ctx.client.interactionCommandClient?.commands
            .map((command) => {
                const c = command as CustomCommand;
                if (c.disabled) {
                    return '';
                }
                if (!ctx.guild)
                    return `${c.requireSpecialPermission ? '🔒' : ''}\`/${command.name}\`: ${command.description}`;
                if (c.requireSpecialPermission && c.permissions) {
                    //eslint-disable-next-line
                    if (
                        c.permissions.every((psm) =>
                            ctx.member?.permissionsIn(
                                //eslint-disable-next-line
                                ctx.channel!,
                                psm,
                            ),
                        )
                    ) {
                        return `${c.requireSpecialPermission ? '🔒' : ''}\`/${command.name}\`: ${command.description}`;
                    }
                }
                return `\`/${command.name}\`: ${command.description}`;
            })
            .filter((s) => s !== '')
            .join('\n');
        return ctx.send({
            content: `Here are the available commands:\n${commands}`,
            flags: 64,
        });
    }
}
