import { CustomCommand } from '@nova/commands/CustomCommand';
import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { StringOption } from '@nova/commands/options/StringOption';
import { ComponentTextDisplay } from 'detritus-client/lib/utils';
import { codestring } from 'detritus-client/lib/utils/markup';

@CustomCommand.applyOptions({
    name: 'roll',
    description: 'roll a dice.',
    options: [
        new StringOption()
            .setName('dice')
            .setRequired(true)
            .setDescription('the die to roll'),

        new StringOption()
            .setName('label')
            .setDescription('the "roll". eg: wisdom check'),
    ],
})
export default class RollCommand extends CustomCommand {
    async exec(ctx: CustomContext<{ dice: string; label?: string }>) {
        let dice = ctx.args.dice;
        const label = ctx.args.label || '';

        if (!dice.includes('d')) {
            if (isNaN(+dice)) {
                return ctx.error('invalid dice. example: d20');
            } else {
                dice = 'd' + dice;
            }
        }

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
                content: `:game_die:${label ? ` [${label}]` : ''} ${codestring(rolles.join(', '))}: \`${total}\` `,
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
        const cursed = 66;

        const change = Math.floor(Math.random() * 10000);
        //TODO: make it
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
