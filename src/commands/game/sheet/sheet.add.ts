import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { BooleanOption } from '@nova/commands/options/BooleanOption';
import { FileOption } from '@nova/commands/options/FileOption';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { UserOption } from '@nova/commands/options/UserOption';
import { MessageFlags } from 'detritus-client/lib/constants';
import { Attachment, User } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';

import { writeFile, readFile } from 'node:fs/promises';
@SubCommand.applyOptions({
    name: 'add',
    description: 'add a sheet to the bot.',
    options: [
        new FileOption()
            .setName('sheet')
            .setRequired(true)
            .setDescription('the sheet you want to import.'),
        new BooleanOption()
            .setName('self')
            .setRequired(false)
            .setDescription(
                'whenever you upload it for a different player. [Server Owner Only]',
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
        const dir = `./data/por_files/${ctx.args.sheet.filename}`;
        ctx.client.logger.debug(
            `creating new sheet in ${dir}. fetching data..`,
            'commands:sheet.add',
        );

        const data = await fetch(ctx.args.sheet.url, {
            method: 'GET',
            headers: {}, // ensures no content-type is added
        });
        ctx.client.logger.debug(
            `done!. ${data.ok === true ? 'OK' : 'NOT_OK'} `,
            'commands:sheet:add',
        );
        if (!data.ok) {
            return ctx.error('failed to fetch the sheet data.');
        }

        const filecontent = Buffer.from(await data.arrayBuffer());
        const player = ctx.args.user?.id ?? ctx.user.id;
        await writeFile(dir, filecontent, { flag: 'w' });
        const char = await ctx.client.pathfinder.sheets.create(
            dir,
            player,
        );
        if (char === null) {
            return ctx.error('too many people to think about...!');
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
                        `Height: ${char.personal.charheight}${char.personal.gender === 'Male' ? "*also known as 6'" : ''}`,
                        `Weight ${char.personal.gender === 'Female' ? '*<do not ask a woman>*' : char.personal.charweight}`,
                        `Age: ${char.personal.age}`,
                    ].join(' | '),
                    `Bio: ${char.personal.description}`,
                ].join('\n'),
            );

        return ctx.say(
            `✅ successfully created the ${char?.name} character sheet for ${!p ? 'the Dm' : p?.mention}.\nHere some basic info:`,
            {
                flags: MessageFlags.SUPPRESS_NOTIFICATIONS,
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
        );
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
