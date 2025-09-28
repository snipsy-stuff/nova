export interface OtherInfo {
    document: Document;
}

export interface Document {
    public: Public;
}

export interface Public {
    program: Program;
    localization: Localization;
    character: Character;
}

export interface Character {
    active: Active;
    characterindex: string;
    nature: string;
    role: string;
    relationship: string;
    type: string;
    name: string;
    playername: string;
    race: Race;
    alignment: Alignment;
    templates: Settings;
    size: Size;
    deity: Alignment;
    challengerating: Challengerating;
    xpaward: Challengerating;
    classes: Classes;
    factions: string;
    types: Types;
    subtypes: Subtypes;
    heropoints: Heropoints;
    senses: Senses;
    auras: string;
    favoredclasses: string;
    health: Health;
    xp: Heropoints;
    money: Money;
    personal: Personal;
    languages: Languages;
    attributes: Attributes;
    saves: Saves;
    defensive: string;
    damagereduction: string;
    immunities: string;
    resistances: string;
    weaknesses: Weaknesses;
    armorclass: Armorclass;
    penalties: Penalties;
    maneuvers: Maneuvers;
    initiative: Initiative;
    movement: Movement;
    encumbrance: Encumbrance;
    skills: Skills;
    skillabilities: string;
    feats: Feats;
    traits: Traits;
    flaws: Flaws;
    skilltricks: string;
    animaltricks: string;
    attack: Attack;
    melee: Melee;
    ranged: string;
    defenses: Defenses;
    magicitems: string;
    gear: string;
    spelllike: Spelllike;
    trackedresources: Trackedresources;
    otherspecials: Otherspecials;
    spellsknown: Spellsknown;
    spellsmemorized: string;
    spellbook: string;
    spellclasses: Spellclasses;
    journals: Journals;
    images: string;
    validation: Validation;
    settings: Settings;
    minions: string;
}

export enum Active {
    Yes = 'yes',
}

export interface Alignment {
    name: string;
}

export interface Armorclass {
    ac: string;
    touch: string;
    flatfooted: string;
    fromarmor: string;
    fromshield: string;
    fromdexterity: string;
    fromwisdom: string;
    fromcharisma: string;
    fromsize: string;
    fromnatural: string;
    fromdeflect: string;
    fromdodge: string;
    frommisc: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface ArmorclassSituationalmodifiers {
    text: string;
}

export interface Attack {
    attackbonus: string;
    meleeattack: string;
    rangedattack: string;
    baseattack: string;
    special: AttackSpecial;
}

export interface AttackSpecial {
    name: string;
    shortname: string;
    type: string;
    sourcetext: string;
    description: string;
    specsource: Name[];
}

export enum Name {
    Oracle = 'Oracle',
}

export interface Attributes {
    attribute: Attribute[];
}

export interface Attribute {
    name: string;
    attrvalue: Attr;
    attrbonus: Attr;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface Attr {
    text: string;
    base: string;
    modified: string;
}

export interface Challengerating {
    value: string;
    text: string;
}

export interface Classes {
    level: string;
    summary: string;
    summaryabbr: string;
    class: Class;
}

export interface Class {
    name: Name;
    level: string;
    spells: string;
    casterlevel: string;
    concentrationcheck: string;
    overcomespellresistance: string;
    basespelldc: string;
    castersource: string;
}

export interface Defenses {
    armor: Armor;
}

export interface Armor {
    name: string;
    ac: string;
    equipped: Active;
    natural: Active;
    useradded: Useradded;
    quantity: string;
    weight: Challengerating;
    cost: Challengerating;
    description: string;
}

export enum Useradded {
    No = 'no',
}

export interface Encumbrance {
    carried: string;
    encumstr: string;
    light: string;
    medium: string;
    heavy: string;
    level: string;
}

export interface Feats {
    feat: Feat[];
}

export interface Feat {
    name: string;
    categorytext: string;
    profgroup?: Active;
    useradded?: Useradded;
    description: string;
    featcategory?: string;
}

export interface Flaws {
    flaw: Flaw[];
}

export interface Flaw {
    name: string;
    description: string;
}

export interface Health {
    hitdice: string;
    hitpoints: string;
    damage: string;
    nonlethal: string;
    currenthp: string;
}

export interface Heropoints {
    total: string;
}

export interface Initiative {
    total: string;
    attrtext: string;
    misctext: string;
    attrname: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface Journals {
    journal: Journal[];
}

export interface Journal {
    name: string;
    gamedate: string;
    realdate: string;
    xp: string;
    pp: string;
    gp: string;
    sp: string;
    cp: string;
    cn1: string;
    cn2: string;
    cn3: string;
    cn4: string;
    prestigeaward: string;
    prestigespend: string;
    description: string;
}

export interface Languages {
    language: Language[];
}

export interface Language {
    name: string;
    useradded: Useradded;
}

export interface Maneuvers {
    cmb: string;
    cmd: string;
    cmdflatfooted: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
    maneuvertype: Maneuvertype[];
}

export interface Maneuvertype {
    name: string;
    bonus: string;
    cmb: string;
    cmd: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface Melee {
    weapon: Weapon[];
}

export interface Weapon {
    name: string;
    categorytext: string;
    typetext: string;
    attack: string;
    crit: string;
    damage: string;
    useradded: Useradded;
    description: string;
    wepcategory: string[] | string;
    weptype: string[] | string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
    quantity?: string;
    weight?: Challengerating;
    cost?: Challengerating;
}

export interface Money {
    total: string;
    pp: string;
    gp: string;
    sp: string;
    cp: string;
    cn1: string;
    cn2: string;
    cn3: string;
    cn4: string;
    valuables: string;
}

export interface Movement {
    speed: Challengerating;
    basespeed: Challengerating;
}

export interface Otherspecials {
    special: OtherspecialsSpecial[];
}

export interface OtherspecialsSpecial {
    name: string;
    shortname: string;
    description: string;
    sourcetext?: string;
    specsource?: string;
    type?: string;
}

export interface Penalties {
    penalty: Penalty[];
}

export interface Penalty {
    name: string;
    text: string;
    value: string;
}

export interface Personal {
    gender: string;
    age: string;
    hair: string;
    eyes: string;
    skin: string;
    description: string;
    charheight: Challengerating;
    charweight: Challengerating;
}

export interface Race {
    racetext: string;
    name: string;
    ethnicity: string;
}

export interface Saves {
    save: Save[];
    allsaves: Allsaves;
}

export interface Allsaves {
    save: string;
    base: string;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface Save {
    name: string;
    abbr: string;
    save: string;
    base: string;
    fromattr: string;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: ArmorclassSituationalmodifiers;
}

export interface Senses {
    special: SensesSpecial;
}

export interface SensesSpecial {
    name: string;
    shortname: string;
    description: string;
}

export interface Settings {
    summary: string;
}

export interface Size {
    name: string;
    space: Challengerating;
    reach: Challengerating;
}

export interface Skills {
    skill: Skill[];
}

export interface Skill {
    name: string;
    ranks: string;
    attrbonus: string;
    attrname: string;
    value: string;
    armorcheck?: Active;
    description: string;
    situationalmodifiers: SkillSituationalmodifiers;
    tools?: string;
    classskill?: Active;
    trainedonly?: Active;
    usable?: Useradded;
}

export interface SkillSituationalmodifiers {
    text: Text;
    situationalmodifier?: Situationalmodifier;
}

export interface Situationalmodifier {
    text: string;
    source: string;
}

export enum Text {
    Charming1VsCharactersWhoCouldBeAttractedToYou = 'Charming: +1 vs. characters who could be attracted to you',
    Empty = '',
}

export interface Spellclasses {
    spellclass: Spellclass;
}

export interface Spellclass {
    name: Name;
    maxspelllevel: string;
    spells: string;
    spelllevel: Spelllevel[];
}

export interface Spelllevel {
    level: string;
    unlimited?: Active;
    used: string;
    maxcasts?: string;
}

export interface Spelllike {
    special: SensesSpecial[];
}

export interface Spellsknown {
    spell: Spell[];
}

export interface Spell {
    name: string;
    level: string;
    class: Name;
    casttime: Casttime;
    range: Range;
    target: string;
    area: Area;
    effect: Effect;
    duration: string;
    save: string;
    resist: string;
    dc: string;
    casterlevel: string;
    componenttext: string;
    schooltext: string;
    subschooltext: Spellsubschool;
    descriptortext: Descriptortext;
    savetext: string;
    resisttext: Resisttext;
    useradded?: Useradded;
    spontaneous: Active;
    description: string;
    spellcomp: Spellcomp[];
    spellschool: string[] | string;
    spellsubschool?: Spellsubschool;
    spelldescript?: Descriptortext;
}

export enum Area {
    ConeShapedEmanation = 'cone-shaped emanation',
    Empty = '',
}

export enum Casttime {
    The1Action = '1 action',
}

export enum Descriptortext {
    Empty = '',
    Light = 'Light',
}

export enum Effect {
    Empty = '',
    IllusorySounds = 'illusory sounds',
}

export enum Range {
    Close255Ft2Levels = 'close (25 + 5 ft./2 levels)',
    The60Ft = '60 ft.',
    Touch = 'touch',
}

export enum Resisttext {
    HarmlessYes = 'Harmless, Yes',
    No = 'No',
    Yes = 'Yes',
}

export enum Spellcomp {
    DivineFocus = 'Divine Focus',
    Material = 'Material',
    MaterialOrDivineFocus = 'Material or Divine Focus',
    Somatic = 'Somatic',
    Verbal = 'Verbal',
}

export enum Spellsubschool {
    Empty = '',
    Figment = 'Figment',
    Healing = 'Healing',
}

export interface Subtypes {
    subtype: Alignment[];
}

export interface Trackedresources {
    trackedresource: Trackedresource[];
}

export interface Trackedresource {
    name: string;
    text: string;
    used: string;
    left: string;
    min: string;
    max: string;
}

export interface Traits {
    trait: Trait[];
}

export interface Trait {
    name: string;
    categorytext: string;
    description: string;
    traitcategory?: string;
}

export interface Types {
    type: Type;
}

export interface Type {
    name: string;
    active: Active;
}

export interface Validation {
    report: string;
}

export interface Weaknesses {
    special: OtherspecialsSpecial;
}

export interface Localization {
    language: string;
    units: string;
}

export interface Program {
    name: string;
    url: string;
    programinfo: string;
    version: Version;
}

export interface Version {
    version: string;
    primary: string;
    secondary: string;
    tertiary: string;
    build: string;
}
