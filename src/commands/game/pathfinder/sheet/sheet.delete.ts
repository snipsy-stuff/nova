import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { NovaShardClient } from '@nova/core/client/ShardClient';
@SubCommand.applyOptions({
    name: 'info',
    description: 'information about a character sheet.',
    options: [
        new AutoComplete()
            .setName('character')
            .setDescription('the name of the character')
            .addAutoComplete(async (ctx) => {
                const pf = (ctx.client as NovaShardClient).games
                    .pathfinder;

                const names = await pf.sheets
                    .list()
                    .then((data) =>
                        data.map((d1) => ({ name: d1.name })),
                    );

                if (!ctx.value) {
                    return ctx.respond({
                        choices: names
                            .map((k) => ({
                                name: k.name,
                                value: k.name,
                            }))
                            .slice(0, 15),
                    });
                }
                return ctx.respond({
                    choices: names
                        .filter((key) =>
                            key.name
                                .toLowerCase()
                                .includes(ctx.value.toLowerCase()),
                        )
                        .map((value) => ({
                            name: value.name,
                            value: value.name,
                        }))
                        .slice(0, 15),
                });
            }),
    ],
})
export class SheetInfoCommand extends SubCommand {
    async exec(ctx: CustomContext<{ character: string }>) {}

    // createDeleteButton(ctx: CustomContext<{ character: string }>) {}
}
