import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { CustomSpell } from '@nova/typings/pathfinder/spell';
import { Embed } from 'detritus-client/lib/utils';
import { readFileSync } from 'fs';

const spells = JSON.parse(
    readFileSync('./data/skills/all-spells.json', 'utf-8'),
) as unknown as CustomSpell[];

@SubCommand.applyOptions({
    name: 'spell',
    description: 'getting information of a spell. ',
    options: [
        new AutoComplete()
            .setName('name')
            .setDescription('the name of the skill')
            .addAutoComplete(async (ctx) => {
                const names = spells
                    .map((spell) => ({
                        name: spell.name,
                        level: +spell.level,
                        class: spell.class,
                    }))
                    .sort((a, b) => a.level - b.level);
                if (!ctx.value) {
                    return ctx
                        .respond({
                            choices: names
                                .map((value) => ({
                                    name: `${value.name} ${value.level}  (${value.class})`,
                                    value: value.name,
                                }))
                                .slice(0, 15),
                        })
                        .catch(console.error);
                }
                const data = names
                    .map((value) => ({
                        name: `${value.name} ${value.level}  (${value.class})`,
                        value: value.name,
                    }))
                    .filter((key) =>
                        key.name
                            .toLowerCase()
                            .includes(ctx.value.toLowerCase()),
                    )
                    .slice(0, 15);
                return ctx
                    .respond({
                        choices: data,
                    })
                    .catch(console.error);
            }),
    ],
})
export class SpellInfoCommand extends SubCommand {
    async exec(ctx: CustomContext<{ name: string }>) {
        const spell = spells.find(
            (spell) => spell.name === ctx.args.name,
        );

        if (!spell) {
            return ctx.error('could not find spell.');
        }
        const descr =
            spell.description.length >= 1901
                ? spell.description.slice(0, 1900) +
                  //https://github.com/snipsy-stuff/data/blob/main/docs/sorcerer/${encodeURIComponent('Dominate Person')}.md)
                  `\n[text too long. more info here](https://github.com/snipsy-stuff/data/blob/main/docs/${spell.class.toLowerCase()}/${encodeURIComponent(spell.name.replace('/', '-'))}.md)`
                : spell.description;
        const description = [
            `**Casting time**: ${spell.casttime}`,
            `**Range**: ${spell.range}`,
            `**Target**: ${spell.target || 'None'}${spell.area ? ` on ${spell.area} area` : ''}`,
            ` **Duration** ${spell.duration}`,
            `**Save**: ${spell.save}`,
            ` **Resist**: ${spell.resist}`,
            Array.isArray(spell.spellcomp)
                ? `**Components**: ${spell.spellcomp.map((sp) => sp).join(', ')}`
                : `**Component**:${spell.spellcomp}` || '',
            descr,
        ].filter((v) => !!v);

        return ctx.send({
            embeds: [
                new Embed()
                    .setAuthor(
                        `Information about ${ctx.args.name} (Level: ${spell.level}, ${spell.class})`,
                    )
                    .setDescription(description.join('\n'))
                    .setColor(0xcdccff)
                    .setFooter('*currently only oracle spells*'),
            ],
        });
    }
}
