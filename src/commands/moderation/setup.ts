import { CustomCommand } from '@nova/commands/CustomCommand';
import {
    // CustomContext,
    GuildContext,
} from '@nova/commands/CustomInteractionContext';
import { colorizeText } from '@nova/util/Util';
// import { ComponentActionRow } from 'detritus-client/lib/structures';
import {
    ComponentTextDisplay,
    ComponentActionRow,
    ComponentButton,
} from 'detritus-client/lib/utils';
import { bold } from 'detritus-client/lib/utils/markup';
import { RootCommand } from 'packages/commands/RootCommand';
@RootCommand.requirePermission(['MANAGE_GUILD'])
@RootCommand.applyOptions({
    name: 'setup',

    description:
        'sets up the bot and all of its features in a quick way.',
})
export default class SetupCommand extends CustomCommand {
    async exec(ctx: GuildContext<Record<string, undefined>>) {
        const u = ctx.user.presence
            ? await ctx.client.rest.fetchUser(ctx.userId)
            : ctx.user;
        const mobile = !!u.presence?.clientStatus?.mobile;
        return ctx.display(
            [
                new ComponentTextDisplay()
                    .setId(0)
                    .setContent(
                        'Welcome to setting up me for your server!',
                    ),
                new ComponentTextDisplay()
                    .setId(1)
                    .setContent(
                        [
                            `following options are currently available`,
                            '`mod-log`: set up logging server specific stuff like channel message update, deletion etc. [disabled by default]',
                        ].join('\n'),
                    ),
                new ComponentTextDisplay()
                    .setId(2)
                    .setContent(
                        mobile
                            ? bold(
                                  'This action will replace all the currently set up settings, this action is IRREVERSABLE!',
                              )
                            : colorizeText(
                                  'red',
                                  `This action will replace all the currently set up settings, this action is IRREVERSABLE!`,
                              ),
                    ),
            ],
            {
                components: [
                    new ComponentActionRow()
                        .addButton(
                            new ComponentButton({
                                custom_id: `setup.${ctx.id}.agree`,
                                disabled: true,
                                label: 'agree',
                            }),
                        )
                        .addButton(
                            new ComponentButton({
                                customId: `setup.${ctx.id}.cancel`,
                                disabled: false,
                                label: 'cancel',
                            }),
                        ),
                ],
            },
        );
    }

    // async setupModlog(
    //     guild: GuildContext<Record<string, undefined>>['guild'],
    // ) {}
}
