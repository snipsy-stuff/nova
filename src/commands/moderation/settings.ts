import { CustomCommand } from '@nova/commands/CustomCommand';
import { GuildContext } from '@nova/commands/CustomInteractionContext';
import { Locales } from 'detritus-client/lib/constants';

import { RootCommand } from 'packages/commands/RootCommand';
@RootCommand.requirePermission(['MANAGE_GUILD'])
@RootCommand.applyOptions({
    name: 'settings',
    nameLocalizations: {
        [Locales.ENGLISH_GB]: 'config',
    },
    description: 'Displays the current Settings for the Server.',
})
export default class SettingsCommand extends CustomCommand {
    async exec(ctx: GuildContext<Record<string, undefined>>) {
        const settings = await ctx.client.db.guilds.findOne({
            guildId: ctx.guildId,
        });

        if (!settings) {
            return ctx.error('unknown error occored. ');
        }
        if (!settings.star_board) {
            return ctx.error('no starboard set.');
        }
        await ctx.say(
            [
                `# starboard ${!settings.star_board.enabled ? '[disabled]' : ''}`,
                settings.star_board.enabled
                    ? [
                          `${ctx.emote('info')} Channel: ${settings.star_board.channel}`,
                          `${ctx.emote('info')} ${
                              settings.star_board.emojis.length > 1
                                  ? `${settings.star_board.emojis.length} triggers set.`
                                  : `<:${settings.star_board.emojis[0].id}>: ${settings.star_board.emojis[0].count}`
                          }`,
                      ].join('\n')
                    : '',
            ].join('\n'),
        );
    }
}
