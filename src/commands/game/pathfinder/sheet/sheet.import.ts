import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { BooleanOption } from '@nova/commands/options/BooleanOption';
import { FileOption } from '@nova/commands/options/FileOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { UserOption } from '@nova/commands/options/UserOption';
import { CustomError } from '@nova/core/errors';
import { SheetData } from '@nova/typings/pathfinder/sheetdata';
import { ProgressList } from '@nova/util/loadingListThing';
import { MessageFlags } from 'detritus-client/lib/constants';
import { Attachment, User } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';
import { codestring } from 'detritus-client/lib/utils/markup';
import { writeFile, readFile } from 'node:fs/promises';
@SubCommand.applyOptions({
    name: 'import',
    description: 'import a sheet to the bot.',
    options: [
        new FileOption()
            .setName('sheet')
            .setRequired(true)
            .setDescription('the sheet you want to import.'),
        new BooleanOption()
            .setName('self')
            .setRequired(false)
            .setDescription(
                'whenever you upload it for a different player',
            ),
        new UserOption()
            .setName('user')
            .setDescription('the user you want to add the sheet for.')
            .setRequired(false),
    ],
})
export class SheetAddCommand extends SubCommand {
    async exec(
        ctx: CustomContext<{
            sheet: Attachment;
            self?: boolean;
            user?: User;
        }>,
    ) {
        const filename = `${ctx.args.sheet.filename}.${Date.now()}.por`;

        const dir = `./data/por_files/${filename}`;
        ctx.client.logger.debug(
            `creating new sheet in ${dir}. fetching data..`,
            'commands:sheet.add',
        );

        const pl = new ProgressList(ctx, {
            error: ctx.emote('error'),
            loading: ctx.emote('loading'),
            success: ctx.emote('success'),
        });
        pl.add('fetching sheet...');
        pl.add('saving .por file...');
        pl.add('parsing sheet...');
        pl.add('saving sheet...');
        pl.add('creating small info...');
        await pl.start();
        let data: Response;
        try {
            data = await fetch(ctx.args.sheet.url, {
                method: 'GET',
                headers: {}, // ensures no content-type is added
            });
            await pl.set('fetching sheet...', 'success');
        } catch (err) {
            console.error(err);
            await pl.set('fetching sheet...', 'error');
            await pl.set('saving .por file...', 'error');
            await pl.set('parsing sheet...', 'error');
            await pl.set('saving sheet...', 'error');
            await pl.set('creating small info...', 'error');
            await pl.end();
            return;
        }

        ctx.client.logger.debug(
            `done!. ${data.ok === true ? 'OK' : 'NOT_OK'} `,
            'commands:sheet:add',
        );
        if (!data.ok) {
            await pl.set('fetching sheet...', 'error');
            await pl.set('saving .por file...', 'error');
            await pl.set('parsing sheet...', 'error');
            await pl.set('saving sheet...', 'error');
            await pl.set('creating small info...', 'error');
            await pl.end();
            return;
        }
        await await ctx.client.games.pathfinder.sheets.createIndex();
        const filecontent = Buffer.from(await data.arrayBuffer());
        const player = ctx.args.user?.id ?? ctx.user.id;
        try {
            await writeFile(dir, filecontent, { flag: 'w' });
            await pl.set('saving .por file...', 'success');
        } catch (err) {
            console.error(err);
            await pl.set('saving .por file...', 'error');
            await pl.set('parsing sheet...', 'error');
            await pl.set('saving sheet...', 'error');
            await pl.set('creating small info...', 'error');
            await pl.end();
            return;
        }
        let char: SheetData | undefined | null = null;

        try {
            char = await ctx.client.games.pathfinder.sheets.create(
                dir,
                player,
            );
            await pl.set('parsing sheet...', 'success');
            await pl.set('saving sheet...', 'success');
        } catch (error) {
            console.log(error);
            await pl.set('parsing sheet...', 'error');
            await pl.set('saving sheet...', 'error');
            await pl.set('creating small info...', 'error');
            await pl.end();
            return;
        }

        if (!char) {
            throw new CustomError('INVALID_CHARACTER_DATA');
        }

        let p: User | null = null;
        if (/\d+/.test(char.player)) {
            p = await ctx.rest.fetchUser(char.player);
        } else {
            p = null;
        }
        let img: Buffer | null = null;
        if (char.image) {
            img = await readFile(char.image);
        }

        const embed = new Embed()
            .setColor(0xcdccff)
            .setThumbnail('attachment://image.png')
            .setAuthor(
                `Sheet Info for ${char.name} (player: ${p ? p.name : 'DM'})`,
            )
            .setDescription(
                [
                    `level: ${char.level}, HP: ${char.health.currenthp}`,
                    `classes ${char.classes.map((cls) => `${cls.name} (${cls.level})`)}`,
                    [
                        `Height: ${char.personal.charheight}`,
                        `Weight ${char.personal.charweight}lbs`,
                        `Age: ${char.personal.age}`,
                    ].join(' | '),
                    `Bio: ${char.personal.description || 'empty over here'}`,
                ].join('\n'),
            );
        await pl.set('creating small info...', 'success');
        await pl.end();
        return ctx
            .say(
                `${ctx.emote('success')} successfully imported and parsed the ${char?.name} character sheet for ${!p ? 'the Dm' : p?.mention}.\nHere some basic info:`,
                {
                    embeds: [embed],
                    files: img
                        ? [
                              {
                                  filename: 'image.png',
                                  value: img,
                              },
                          ]
                        : undefined,
                },
            )
            .catch(console.error);
    }

    /*async mkfile(filename: string) {
        return new Promise((res, rej) => {
            return exec(
                `unzip ${filename} -d ${this.paths.extracted}/${parse(filename).name}`,
                (err, stdout, stderr) => {
                    if (err || stderr) {
                        return rej(err || stderr);
                    }
                    return res(stdout);
                },
            );
        });
    }*/
}
