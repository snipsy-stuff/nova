import { CustomContext } from '@nova/commands/CustomInteractionContext';
import { AutoComplete } from '@nova/commands/options/AutoComplete';
import { SubCommand } from '@nova/commands/options/SubCommand';
import { Embed } from 'detritus-client/lib/utils';
import { codestring } from 'detritus-client/lib/utils/markup';
import { readFileSync } from 'fs';

const spells = JSON.parse(
    readFileSync('./data/skills/spells.json', 'utf-8'),
) as unknown as Spell[];

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
                    .filter((key) =>
                        key.name
                            .toLowerCase()
                            .includes(ctx.value.toLowerCase()),
                    )
                    .map((value) => ({
                        name: `${value.name} ${value.level}  (${value.class})`,
                        value: value.name,
                    }))
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

        const description = [
            `Casting time: ${codestring(spell.casttime)} | Range: ${codestring(spell.range)}`,
            `Target: ${codestring(spell.target)}${spell.area ? codestring(` on ${spell.area} area`) : ''}  | Duration ${codestring(spell.duration)}`,
            `Save: ${codestring(spell.save)} | Resist: ${codestring(spell.resist)}`,
            Array.isArray(spell.spellcomp)
                ? `Components: ${spell.spellcomp.map((sp) => codestring(sp)).join(', ')}`
                : spell.spellcomp || '',
            spell.description.slice(0, 1900),
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

export interface Spell {
    name: string;
    level: string;
    class: string;
    casttime: Casttime;
    range: string;
    target: string;
    area: string;
    effect: string;
    duration: string;
    save: string;
    resist: string;
    dc: string;
    casterlevel: string;
    componenttext: Componenttext;
    schooltext: string;
    subschooltext: Ethnicity;
    descriptortext: string;
    savetext: string;
    resisttext: Resisttext;
    spontaneous: Trainedonly;
    description: string;
    spellcomp?: SpellcompElement[] | Componenttext;
    spellschool: string[] | SpellschoolEnum;
    spellsubschool?: Ethnicity[] | Ethnicity;
    spelldescript?: string[] | string;
    useradded?: string;
}

enum SpellcompElement {
    DivineFocus = 'Divine Focus',
    Focus = 'Focus',
    FocusOrDivineFocus = 'Focus or Divine Focus',
    Material = 'Material',
    MaterialOrDivineFocus = 'Material or Divine Focus',
    SeeText = 'See Text',
    Somatic = 'Somatic',
    Thought = 'Thought',
    Verbal = 'Verbal',
    XPCost = 'XP Cost',
}

export enum SpellschoolEnum {
    Abjuration = 'Abjuration',
    Conjuration = 'Conjuration',
    Divination = 'Divination',
    Enchantment = 'Enchantment',
    Evocation = 'Evocation',
    Illusion = 'Illusion',
    Necromancy = 'Necromancy',
    Transmutation = 'Transmutation',
    Universal = 'Universal',
}

enum Trainedonly {
    Yes = 'yes',
    No = 'no0',
}

enum Resisttext {
    Empty = '',
    HarmlessNo = 'Harmless, No',
    HarmlessNoSeeText = 'Harmless, No, See Text',
    HarmlessNoYes = 'Harmless, No, Yes',
    HarmlessObjectSeeTextYes = 'Harmless, Object, See Text, Yes',
    HarmlessObjectYes = 'Harmless, Object, Yes',
    HarmlessSeeTextYes = 'Harmless, See Text, Yes',
    HarmlessYes = 'Harmless, Yes',
    No = 'No',
    NoObject = 'No, Object',
    NoObjectSeeText = 'No, Object, See Text',
    NoObjectSeeTextYes = 'No, Object, See Text, Yes',
    NoSeeText = 'No, See Text',
    NoSeeTextYes = 'No, See Text, Yes',
    ObjectSeeTextYes = 'Object, See Text, Yes',
    ObjectYes = 'Object, Yes',
    SeeText = 'See Text',
    SeeTextYes = 'See Text, Yes',
    Special = 'Special',
    Yes = 'Yes',
}

enum Casttime {
    Ct2Min = 'ct2Min',
    Empty = '',
    SeeText = 'see text',
    The10Minutes = '10 minutes',
    The10MinutesOrMoreSeeText = '10 minutes or more; see text',
    The1Action = '1 action',
    The1Day = '1 day',
    The1FullRoundAction = '1 full-round action',
    The1Hour = '1 hour',
    The1ImmediateAction = '1 immediate action',
    The1Minute = '1 minute',
    The1MinutePerPage = '1 minute per page',
    The1Round = '1 round',
    The1RoundOr4HoursSeeText = '1 round or 4 hours; see text',
    The1SwiftAction = '1 swift action',
    The1SwiftActionOrImmediateActionSeeText = '1 swift action or immediate action; see text',
    The1Week = '1 week',
    The20Minutes = '20 minutes',
    The24Hours = '24 hours',
    The2Hours = '2 hours',
    The2Rounds = '2 rounds',
    The30Minutes = '30 minutes',
    The3Rounds = '3 rounds',
    The4Hours = '4 hours',
    The5Minutes = '5 minutes',
    The6Hours = '6 hours',
    The6Rounds = '6 rounds',
    The8Hours = '8 hours',
    The9Days = '9 days',
}

enum Componenttext {
    Empty = '',
    MaterialOrDivineFocus = 'Material or Divine Focus',
    Somatic = 'Somatic',
    SomaticDivineFocus = 'Somatic, Divine Focus',
    SomaticFocus = 'Somatic, Focus',
    SomaticMaterial = 'Somatic, Material',
    SomaticMaterialDivineFocus = 'Somatic, Material, Divine Focus',
    SomaticMaterialOrDivineFocus = 'Somatic, Material or Divine Focus',
    ThoughtSomaticMaterial = 'Thought, Somatic, Material',
    VOrS = 'V or S',
    Verbal = 'Verbal',
    VerbalDivineFocus = 'Verbal, Divine Focus',
    VerbalFocus = 'Verbal, Focus',
    VerbalFocusOrDivineFocus = 'Verbal, Focus or Divine Focus',
    VerbalMaterial = 'Verbal, Material',
    VerbalMaterialOrDivineFocus = 'Verbal, Material or Divine Focus',
    VerbalSomatic = 'Verbal, Somatic',
    VerbalSomaticDivineFocus = 'Verbal, Somatic, Divine Focus',
    VerbalSomaticFocus = 'Verbal, Somatic, Focus',
    VerbalSomaticFocusDivineFocus = 'Verbal, Somatic, Focus, Divine Focus',
    VerbalSomaticFocusMaterialOrDivineFocus = 'Verbal, Somatic, Focus, Material or Divine Focus',
    VerbalSomaticFocusOrDivineFocus = 'Verbal, Somatic, Focus or Divine Focus',
    VerbalSomaticFocusSeeText = 'Verbal, Somatic, Focus, See Text',
    VerbalSomaticMaterial = 'Verbal, Somatic, Material',
    VerbalSomaticMaterialDivineFocus = 'Verbal, Somatic, Material, Divine Focus',
    VerbalSomaticMaterialDivineFocusSeeText = 'Verbal, Somatic, Material, Divine Focus, See Text',
    VerbalSomaticMaterialDivineFocusXPCost = 'Verbal, Somatic, Material, Divine Focus, XP Cost',
    VerbalSomaticMaterialFocus = 'Verbal, Somatic, Material, Focus',
    VerbalSomaticMaterialFocusDivineFocus = 'Verbal, Somatic, Material, Focus, Divine Focus',
    VerbalSomaticMaterialMaterialOrDivineFocus = 'Verbal, Somatic, Material, Material or Divine Focus',
    VerbalSomaticMaterialOrDivineFocus = 'Verbal, Somatic, Material or Divine Focus',
    VerbalSomaticMaterialOrDivineFocusSeeText = 'Verbal, Somatic, Material or Divine Focus, See Text',
    VerbalSomaticMaterialSeeText = 'Verbal, Somatic, Material, See Text',
    VerbalSomaticMaterialXPCost = 'Verbal, Somatic, Material, XP Cost',
    VerbalSomaticSeeText = 'Verbal, Somatic, See Text',
    VerbalSomaticXPCost = 'Verbal, Somatic, XP Cost',
}

enum Ethnicity {
    Animation = 'Animation',
    AnimationNecrophagy = 'Animation, Necrophagy',
    Calling = 'Calling',
    CallingCreation = 'Calling, Creation',
    Charm = 'Charm',
    CharmNecrophagy = 'Charm, Necrophagy',
    Compulsion = 'Compulsion',
    CompulsionCurse = 'Compulsion, Curse',
    CompulsionLanguageDependentMindAffecting = 'Compulsion, Language-Dependent, Mind-Affecting',
    CompulsionMindAffecting = 'Compulsion, Mind-Affecting',
    CompulsionNecrophagy = 'Compulsion, Necrophagy',
    Creation = 'Creation',
    CreationLight = 'Creation, Light',
    CreationSummoning = 'Creation, Summoning',
    CreationTeleportation = 'Creation, Teleportation',
    Curse = 'Curse',
    Darkness = 'Darkness',
    Electric = 'Electric',
    Emotion = 'Emotion',
    Empty = '',
    Evil = 'Evil',
    EvilLawfulSummoning = 'Evil, Lawful, Summoning',
    Figment = 'Figment',
    Glamer = 'Glamer',
    Good = 'Good',
    GoodLight = 'Good, Light',
    Grief = 'Grief',
    GriefMindAffecting = 'Grief, Mind-Affecting',
    Healing = 'Healing',
    LanguageDependent = 'Language-Dependent',
    Lawful = 'Lawful',
    Light = 'Light',
    MindAffecting = 'Mind-Affecting',
    Necrophagy = 'Necrophagy',
    None = 'None',
    Pattern = 'Pattern',
    Phantasm = 'Phantasm',
    Polymorph = 'Polymorph',
    Scrying = 'Scrying',
    Shadow = 'Shadow',
    Summoning = 'Summoning',
    Teleportation = 'Teleportation',
}
