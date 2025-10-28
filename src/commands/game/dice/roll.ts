import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import { ComponentTextDisplay } from 'detritus-client/lib/utils';
import { codestring } from 'detritus-client/lib/utils/markup';
@CustomCommand.applyOptions({
    name: 'roll',
    description:
        'roll a dice. IF a sheet is present and `label` is used, `dice` will be ignored.',
    options: [
        new StringOption()
            .setName('dice')
            .setRequired(false)
            .setDescription(
                'the die to roll, ignored if `label` is registered.',
            ),

        new StringOption()
            .setName('label')
            .setChoices([
                {
                    name: 'Fortitude Save',
                    value: 'fort',
                },
                {
                    name: 'Reflex Save',
                    value: 'ref',
                },
                {
                    name: 'Will save',
                    value: 'will',
                },
                {
                    name: 'Initiative',
                    value: 'init',
                },
            ])
            .setDescription('the "roll". eg: wisdom check'),
    ],
})
export default class RollCommand extends CustomCommand {
    async exec(ctx: CustomContext<{ dice: string; label?: string }>) {
        let dice = ctx.args.dice;
        const label = ctx.args.label || '';

        if (label) {
            const player = ctx.user.id;

            const existing = (
                await ctx.client.games.pathfinder.sheets.list()
            ).find((c) => c.player === player);
            if (existing) {
                const character =
                    await ctx.client.games.pathfinder.sheets.get(
                        existing.name,
                    );
                if (character) {
                    switch (label) {
                        case 'fort':
                            const dFort = `1d20+${character.saves.find((save) => save.abbr === 'Will')?.save || '0'}`;
                            const {
                                total: totalFort,
                                details: detailsFort,
                            } = this.roll(dFort);

                            const rollsFort: number[] = [];
                            const rollesFort: string[] = [];
                            for (const det of detailsFort) {
                                rollsFort.push(...det.rolls);
                                rollesFort.push(det.dice);
                            }

                            const strFort = [
                                '```js',
                                rollsFort.join(', '),
                                '```',
                            ].join('\n');
                            const containerFort = [
                                new ComponentTextDisplay({
                                    content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(dFort)}: \`${totalFort}\` `,
                                }),
                                new ComponentTextDisplay({
                                    content: strFort,
                                }),
                            ];
                            return ctx.display(containerFort);
                        case 'will':
                            const d = `1d20+${character.saves.find((save) => save.abbr === 'Will')?.save || '0'}`;
                            const { total, details } = this.roll(d);

                            const rolls: number[] = [];
                            const rolles: string[] = [];
                            for (const det of details) {
                                rolls.push(...det.rolls);
                                rolles.push(det.dice);
                            }

                            const str = [
                                '```js',
                                rolls.join(', '),
                                '```',
                            ].join('\n');
                            const container = [
                                new ComponentTextDisplay({
                                    content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(d)}: \`${total}\` `,
                                }),
                                new ComponentTextDisplay({
                                    content: str,
                                }),
                            ];
                            return ctx.display(container);
                        case 'init':
                            const d2 = `1d20${character.initiative.total || ''}`;

                            const {
                                total: total2,
                                details: details2,
                            } = this.roll(d2);

                            const rolls2: number[] = [];
                            const rolles2: string[] = [];
                            for (const det of details2) {
                                rolls2.push(...det.rolls);
                                rolles2.push(det.dice);
                            }

                            const str2 = [
                                '```js',
                                rolls2.join(', '),
                                '```',
                            ].join('\n');
                            const container2 = [
                                new ComponentTextDisplay({
                                    content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(d2)}: \`${total2}\` `,
                                }),
                                new ComponentTextDisplay({
                                    content: str2,
                                }),
                            ];
                            return ctx.display(container2);
                        case 'ref':
                            const dref = `1d20+${character.saves.find((save) => save.abbr === 'Will')?.save || '0'}`;
                            const {
                                total: totalRef,
                                details: detailsRef,
                            } = this.roll(dref);

                            const rollsref: number[] = [];
                            const rollesref: string[] = [];
                            for (const det of detailsRef) {
                                rollsref.push(...det.rolls);
                                rollesref.push(det.dice);
                            }

                            const strref = [
                                '```js',
                                rollsref.join(', '),
                                '```',
                            ].join('\n');
                            const containerref = [
                                new ComponentTextDisplay({
                                    content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(dref)}: \`${totalRef}\` `,
                                }),
                                new ComponentTextDisplay({
                                    content: strref,
                                }),
                            ];
                            return ctx.display(containerref);
                        default:
                    }
                }
            }
        }
        if (!dice.includes('d')) {
            if (isNaN(+dice)) {
                return ctx.error('invalid dice. example: d20');
            } else {
                dice = 'd' + dice;
            }
        }
        await ctx.say('rolling...');
        const { total, details } = this.roll(dice);

        const rolls: number[] = [];
        const rolles: string[] = [];
        for (const det of details) {
            rolls.push(...det.rolls);
            rolles.push(det.dice);
        }

        const str = ['```js', rolls.join(', '), '```'].join('\n');
        const container = [
            new ComponentTextDisplay({
                content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(dice)}: \`${total}\` `,
            }),
            new ComponentTextDisplay({
                content: str,
            }),
        ];
        return ctx.display(container);
    }

    roll(input: string): {
        total: number;
        details: DiceResult[];
    } {
        const blessed = 69;
        const cursed = 666;

        const change = Math.floor(Math.random() * 10000);
        const blessedOrCursed: 'blessed' | 'cursed' | undefined =
            change === blessed
                ? 'blessed'
                : change === cursed
                  ? 'cursed'
                  : undefined;

        const diceRegex = /(\d*)d(\d+)([+-]\d+)?/g;
        const results: DiceResult[] = [];
        let match: RegExpExecArray | null;

        while ((match = diceRegex.exec(input)) !== null) {
            const numDice = parseInt(match[1]) || 1;
            const diceSides = parseInt(match[2]);
            const modifier = match[3] ? parseInt(match[3]) : 0;

            const rolls: number[] = [];
            for (let i = 0; i < Math.min(numDice, 200); i++) {
                if (blessedOrCursed === 'blessed') {
                    rolls.push(Math.min(diceSides, 100));
                }

                if (blessedOrCursed === 'cursed') {
                    rolls.push(1);
                }

                rolls.push(
                    Math.floor(
                        Math.random() * Math.min(diceSides, 100),
                    ) + 1,
                );
            }

            const subtotal =
                rolls.reduce((sum, val) => sum + val, 0) + modifier;

            results.push({
                expression: match[0],
                rolls,
                modifier,
                dice: `${Math.min(numDice, 200)}d${Math.min(diceSides, 100)}`,
                total: subtotal,
            });
        }

        const grandTotal = results.reduce(
            (sum, r) => sum + r.total,
            0,
        );

        return {
            total: grandTotal,
            details: results,
        };
    }
}

interface DiceResult {
    expression: string;
    rolls: number[];
    modifier: number;
    total: number;
    dice: string;
}
