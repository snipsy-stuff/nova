import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { SheetData } from '@nova/typings/pathfinder/sheetdata';
import { MessageComponentButtonStyles } from 'detritus-client/lib/constants';
import {
    ComponentActionRow,
    ComponentButton,
    Embed,
} from 'detritus-client/lib/utils';
import { readFile } from 'node:fs/promises';
const file = './data/sheets/index.json';
@SubCommand.applyOptions({
    name: 'info',
    description: 'information about a character sheet.',
    options: [
        new AutoComplete()
            .setName('character')
            .setDescription('the name of the character')
            .addAutoComplete(async (ctx) => {
                const data = JSON.parse(
                    await readFile(file, 'utf-8'),
                );

                const keys = Object.keys(data);
                if (!ctx.value) {
                    return ctx.respond({
                        choices: keys.map((k) => ({
                            name: k,
                            value: data[k],
                        })),
                    });
                }
                return ctx.respond({
                    choices: keys
                        .filter((key) => key.includes(ctx.value))
                        .map((value) => ({
                            name: value,
                            value: data[value],
                        })),
                });
            }),
    ],
})
export class SheetInfoCommand extends SubCommand {
    async exec(ctx: CustomContext<{ character: string }>) {
        ctx.client.logger.debug(
            `fetching info for ${ctx.args.character}`,
            'COMMAND_RUN:SHEET_INFO',
        );
        if (!ctx.args.character) {
            return ctx.error(
                'could not parse character from sheet. does it even exist?!',
            );
        }
        const character = JSON.parse(
            await readFile(ctx.args.character, 'utf-8').catch(
                () => 'null',
            ),
        ) as SheetData | 'null';
        if (character === 'null') {
            return ctx.error(
                'could not parse character from sheet. does it even exist?!',
            );
        }

        const { components, embeds, img } =
            await this.createMainResponse(ctx, character);

        return ctx.send({
            embeds: embeds,
            components: components,
            files: img
                ? [{ value: img, filename: 'image.jpg' }]
                : undefined,
        });
    }

    createBackButton(
        ctx: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'back',
            style: MessageComponentButtonStyles.DANGER,
            custom_id: `sheet.info:${ctx.user.id}:${character.name}:back`,
            run: async (ctx2) => {
                const { components, embeds, img } =
                    await this.createMainResponse(ctx, character);

                return ctx2.editOrRespond({
                    embeds: embeds,
                    components: components,
                    files: img
                        ? [{ value: img, filename: 'image.jpg' }]
                        : undefined,
                });
            },
        });
    }

    async createMainResponse(
        ctx: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        let player: string | null = null;

        if (/\d+/.test(character.player)) {
            player =
                ctx.users.get(character.player)?.name ||
                (await ctx.rest.fetchUser(character.player)).name;
        } else if (character.player === 'DM') {
            player = 'DM';
        } else {
            player = '*<unknown>*';
        }

        let img: Buffer | null = null;

        if (character.image) {
            img = await readFile(character.image);
        }

        const mainEmbed = new Embed()
            .setColor(0xcdccff)
            .setAuthor(`Sheet Info for ${character.name}`)
            .setDescription(
                [
                    `Name: ${character.name}  | Player ${player}`,
                    `HP: ${character.health.currenthp}  | Attack: ${character.attack[0].baseattack} | Speed: ${character.movement.base}ft`,
                    `Age: ${character.personal.age} | Height: ${character.personal.charheight} | Weight: ${character.personal.charweight}`,
                    `Class${character.classes.length === 1 ? '' : 'es'}: ${character.classes.map((cls) => `${cls.name} (${cls.level})`).join(', ')}`,
                ].join('\n'),
            )
            .setThumbnail('attachment://image.jpg')
            .setFooter(`Requested by ${ctx.user.name}`);

        const utilityRow = [
            new ComponentActionRow(),
            new ComponentActionRow(),
            new ComponentActionRow(),
        ];
        utilityRow[0]
            .addButton(this.createAttributesButton(ctx, character))
            .addButton(this.createSkillsButton(ctx, character))
            .addButton(this.createFeatButton(ctx, character));

        utilityRow[1]
            .addButton(this.createPenaltiesButton(ctx, character))
            .addButton(this.createFlawButton(ctx, character))
            .addButton(this.createPersonalButton(ctx, character));

        utilityRow[2]
            .addButton(this.createWeaponsButton(ctx, character))
            .addButton(this.createSavesButton(ctx, character))
            .addButton(this.createSpellButton(ctx, character));

        const mainComponents = utilityRow;

        return {
            embeds: [mainEmbed],
            img,
            components: mainComponents,
        };
    }

    createAttributesButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'attributes',
            customId: `skill.info:${context.userId}:${character.name}:attributes`,
            run: (ctx) => {
                const embed = new Embed().setColor(0xcdccff);

                for (const attribute of character.attributes) {
                    embed.addField(
                        attribute.name,
                        `${attribute.value.text}${attribute.bonus ? `(${attribute.bonus.text})` : ''}`,
                    );
                }

                return ctx.editOrRespond({
                    embeds: [embed],
                    flags: 64,
                    components: [
                        new ComponentActionRow().addButton(
                            this.createBackButton(context, character),
                        ),
                    ],
                });
            },
        });
    }

    createSkillsButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'skills',
            customId: `skill.info:${context.userId}:${character.name}:skills`,
            run: (ctx) => {
                const skills = character.skills;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(`${skill.name}`)
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .setDescription(
                                skill.description
                                    .replace(/\n\n/, '\n')
                                    .slice(0, 2000),
                            ),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:skills:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:skills:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }
    createFeatButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'feats',
            customId: `skill.info:${context.userId}:${character.name}:feats`,
            run: (ctx) => {
                const skills = character.feats;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(
                                `${skill.name} [${skill.categorytext}]`,
                            )
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .setDescription(
                                skill.description
                                    .replace(/\n\n/, '\n')
                                    .slice(0, 2000),
                            ),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:feats:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:feats:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }

    createPenaltiesButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'penalties',
            customId: `skill.info:${context.userId}:${character.name}:penalties`,
            run: (ctx) => {
                const skills = character.penalties;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(`${skill.name}`)
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .setDescription(`${skill.value}`),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:penalties:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:penalties:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }
    createFlawButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'flaws',
            customId: `skill.info:${context.userId}:${character.name}:flaws`,
            run: (ctx) => {
                const skills = character.flaws;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(`${skill.name}`)
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .setDescription(
                                `${skill.description.slice(0, 2000)} *more info hidden*`,
                            ),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:flaws:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:flaws:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }

    createPersonalButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'personal',
            customId: `skill.info:${context.userId}:${character.name}:personal`,
            run: (ctx) => {
                const personal = character.personal;

                const embed = new Embed()
                    .setColor(0xcdccff)
                    .setAuthor(
                        `Personal Info about ${character.name}`,
                    )
                    .setDescription(
                        [
                            `Gender: ${personal.gender || 'unspecified'} | Age: ${personal.age} | Height: ${personal.charheight} `,
                            `Hair ${personal.hair} | Eyes: ${personal.eyes} | Skin: ${personal.skin}`,
                            `Money: ${character.money.total} `,
                        ].join('\n'),
                    );
                const components = [new ComponentActionRow()];

                if (personal.description) {
                    components[0].addButton(
                        new ComponentButton({
                            label: 'Bio',
                            customId: `skill.info:${context.userId}:${character.name}:personal:bio`,
                            run: (ctx2) => {
                                const em = new Embed()
                                    .setColor(0xcdccff)
                                    .setDescription(
                                        personal.description.slice(
                                            0,
                                            4000,
                                        ),
                                    );

                                console.log('running');
                                return ctx2.editOrRespond({
                                    embeds: [em],
                                    flags: 64,
                                });
                            },
                        }),
                    );
                }

                components[0].addButton(
                    this.createBackButton(context, character),
                );

                return ctx.editOrRespond({
                    embeds: [embed],
                    flags: 64,
                    components: components,
                });
            },
        });
    }

    createWeaponsButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'weapons',
            customId: `skill.info:${context.userId}:${character.name}:weapons`,
            run: (ctx) => {
                const k = Object.keys(character.weapons);
                const weapons = [];
                for (const s of k) {
                    for (const weapon of character.weapons[
                        s as 'melee'
                    ]) {
                        weapons.push({
                            name: weapon.name,
                            description: weapon.description,
                            damage: weapon.damage,
                            itempwoer: weapon.itempower,
                            attack: weapon.attack,
                            type: s,
                        });
                    }
                }
                let i = 0;
                const embeds: Embed[] = [];
                for (const weapon of weapons) {
                    const embed2 = new Embed()
                        .setColor(0xcdccff)
                        .setColor(0xcdccff)
                        .setAuthor(
                            `Weapon: ${weapon.name} [${weapon.type}]`,
                        )
                        .setDescription(
                            [
                                `Attack: ${weapon.attack} | Damage: ${weapon.damage}`,
                                `Description: ${weapon.description.replace(/\n\n/, '\n').slice(0, 3500)} *and more*`,
                            ].join('\n'),
                        );

                    embeds.push(embed2);
                }
                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:weapons:previous`,
                            run: (ctx) => {
                                console.log('run2');
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx
                                    .editOrRespond({
                                        components: [movebuttons],
                                        embeds: [embeds[i]],
                                        flags: 64,
                                    })
                                    .catch((e) =>
                                        console.error(
                                            JSON.stringify(e),
                                        ),
                                    );
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:weapons:next`,
                            run: (ctx) => {
                                console.log('run');
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx
                                    .editOrRespond({
                                        components: [movebuttons],
                                        flags: 64,
                                        embeds: [embeds[i]],
                                    })
                                    .catch((e) =>
                                        console.error(
                                            JSON.stringify(e),
                                        ),
                                    );
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }

    createSavesButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'saves',
            customId: `skill.info:${context.userId}:${character.name}:saves`,
            run: (ctx) => {
                const skills = character.saves;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(`${skill.name}`)
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .setDescription(
                                `Base: ${skill.base} | Save: ${skill.save}`,
                            ),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:saves:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:saves:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }

    createSpellButton(
        context: CustomContext<{ character: string }>,
        character: SheetData,
    ) {
        return new ComponentButton({
            label: 'spelllike',
            customId: `skill.info:${context.userId}:${character.name}:spelllike`,
            run: (ctx) => {
                const skills = character.spelllike.special;
                const embeds: Embed[] = [];
                let i = 0;
                for (const skill of skills) {
                    embeds.push(
                        new Embed()
                            .setColor(0xcdccff)
                            .setAuthor(`${skill.name}`)
                            .setColor(0xccdccf)
                            .setFooter(
                                `requested by ${ctx.user.name}`,
                            )
                            .addField(
                                'Source',
                                skill.sourcetext || 'Pathfinder core',
                            )
                            .setDescription(
                                skill.description.slice(0, 4000) +
                                    '*and more*',
                            ),
                    );
                }

                const movebuttons = new ComponentActionRow()
                    .addButton(
                        new ComponentButton({
                            label: 'previous',
                            customId: `skill.info:${context.userId}:${character.name}:spells:previous`,
                            run: (ctx) => {
                                if (i === 0) {
                                    i = embeds.length - 1;
                                } else {
                                    i--;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    embeds: [embeds[i]],
                                    flags: 64,
                                });
                            },
                        }),
                    )
                    .addButton(
                        new ComponentButton({
                            label: 'next',
                            customId: `skill.info:${context.userId}:${character.name}:spells:next`,
                            run: (ctx) => {
                                if (i === embeds.length - 1) {
                                    i = 0;
                                } else {
                                    i++;
                                }
                                return ctx.editOrRespond({
                                    components: [movebuttons],
                                    flags: 64,
                                    embeds: [embeds[i]],
                                });
                            },
                        }),
                    )
                    .addButton(
                        this.createBackButton(context, character),
                    );

                return ctx.editOrRespond({
                    embeds: [embeds[0]],
                    flags: 64,
                    components: [movebuttons],
                });
            },
        });
    }

    // createDeleteButton(ctx: CustomContext<{ character: string }>) {}
}
