import { Spellsknown } from './other-info';

export interface SheetData {
    program: Program;
    name: string;
    active: boolean;
    player: string;
    index: number;
    nature: string;
    role: string;
    alignment: string;
    image?: string;
    other: Other;
    relationship: string;
    type: string;
    race: Race;
    size: number;
    deity: string;
    level: number;
    classes: ClassElement[];
    factions: string;
    body: string;
    subbodies: string[];
    heropoint: number;
    senses: Spelllike[];
    auras: string;
    favoredclass: FavoredclassEnum;
    health: Health;
    xp: number;
    money: Money;
    personal: Personal;
    languages: string[];
    attributes: Attribute[];
    saves: Save[];
    allsaves: Allsave[];
    defensive: Defensive[];
    damagereduction: Damagereduction[];
    immunities: Damagereduction[];
    resistances: Defensive[];
    weaknesses: string;
    armorclass: Armorclass;
    penalties: Penalty[];
    maneuvers: Maneuver[];
    initiative: Initiative;
    movement: Movement;
    encumbrance: Encumbrance;
    skills: Skill[];
    skillabilities: string;
    feats: Feat[];
    traits: Trait[];
    flaws: Flaw[];
    skilltricks: string;
    animaltricks: string;
    attack: Attack[];
    weapons: Weapons;
    defenses: Defenses;
    items: Items;
    gear: Gear[];
    spelllike: Spelllike;
    trackedresources: Trackedresource[];
    specials: AttackSpecial[];
    spellsknown: Spellsknown[];
    spellsmemorized: Spellsmemorized[];
    spellbook: string;
    spellclasses: Spellclass[];
    journals: Journal[];
    validation: Validation[];
    settings: Setting[];
    minions: string;
}

export interface Allsave {
    save: number;
    base: number;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: string;
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
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface ArmorclassSituationalmodifier {
    text: string;
}

export interface Attack {
    attackbonus: string;
    meleeattack: string;
    rangedattack: string;
    baseattack: string;
    special: AttackSpecial[];
}

export interface AttackSpecial {
    name: string;
    shortname: string;
    type?: Type;
    sourcetext?: string;
    description: string;
    specsource?: string[] | string;
}

export enum Type {
    ExtraordinaryAbility = 'Extraordinary Ability',
    ExtraordinaryAbilitySupernaturalAbility = 'Extraordinary Ability, Supernatural Ability',
    SpellLikeAbility = 'Spell-Like Ability',
    SupernaturalAbility = 'Supernatural Ability',
}

export interface Attribute {
    name: string;
    value: Bonus;
    situationalmodifiers: AttributeSituationalmodifier[];
    bonus: Bonus;
}

export interface Bonus {
    text: string;
    base: string;
    modified: string;
}

export interface AttributeSituationalmodifier {
    name: string;
    modifiers?: Modifier[];
}

export interface Modifier {
    data: string;
    name: string;
}

export interface ClassElement {
    name: string;
    level: number;
    spells: string;
    casterlevel: number;
    concentrationcheck: string;
    overcomespellresistance: string;
    basespelldc: number;
    castersource: string;
    arcanespellfailure?: number[];
}

export interface Damagereduction {
    special: DamagereductionSpecial;
}

export interface DamagereductionSpecial {
    name: string;
    shortname: string;
    description: string;
}

export interface Defenses {
    armor: Armor[];
}

export interface Armor {
    name: string;
    ac: string;
    equipped: boolean;
    natural: boolean;
    useradded: boolean;
    quantity: number;
    weight: number;
    cost: number;
    description: string;
}

export interface Defensive {
    special: DefensiveSpecial;
}

export interface DefensiveSpecial {
    name: string;
    shortname: string;
    type?: Type;
    sourcetext?: Sourcetext;
    description: string;
    specsource?: Sourcetext;
}

export enum Sourcetext {
    Celestial = 'Celestial',
    HalfCelestial = 'Half-Celestial',
    Universal = 'Universal',
}

export interface Encumbrance {
    carried: string;
    encumstr: string;
    light: string;
    medium: string;
    heavy: string;
    level: string;
}

export enum FavoredclassEnum {
    Magus = 'Magus',
}

export interface Feat {
    name: string;
    categorytext: Categorytext;
    profgroup: boolean;
    useradded: boolean;
    description: string;
    featcategory?: string[] | Categorytext;
}

export enum Categorytext {
    Combat = 'Combat',
    CombatCombatStyle = 'Combat, Combat Style',
    Empty = '',
    Mythic = 'Mythic',
}

export interface Flaw {
    name: string;
    description: string;
}

export interface Gear {
    name: string;
    quantity: number;
    weight: number;
    cost: number;
    description: string;
}

export interface Health {
    hitdice: string;
    hitpoints: number;
    damage: number;
    nonlethal: number;
    currenthp: number;
}

export interface Initiative {
    total: string;
    attrtext: string;
    misctext: string;
    attrname: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface Items {
    magic: Record<string, unknown>[];
    item: Item[];
}

export interface Item {
    name: string;
    quantity: number;
    weight: number;
    cost: number;
    description: string;
    itemslot?: string;
    itempower?: Itempower[];
}

export interface Itempower {
    name: string;
    pricebonusvalue: string;
    pricebonustext: string;
    pricecashvalue: string;
    pricecashtext: Pricecashtext;
    description: string;
}

export enum Pricecashtext {
    Empty = '',
    The15000Gp = '15,000 gp',
    The16875Gp = '16,875 gp',
    The8000Gp = '8,000 gp',
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

export interface Maneuver {
    cmb: string;
    cmd: string;
    cmdflatfooted: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
    maneuvertype: Maneuvertype[];
}

export interface Maneuvertype {
    name: string;
    bonus: string;
    cmb: string;
    cmd: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface Money {
    total: number;
    pp: number;
    gp: number;
    sp: number;
    cp: number;
    cn1: number;
    cn2: number;
    cn3: number;
    cn4: number;
    valuables: number;
}

export interface Movement {
    speed: number;
    base: number;
}

export interface Other {
    templates: Setting[];
}

export interface Setting {
    summary: string;
}

export interface Penalty {
    name: string;
    text: string;
    value: string;
}

export interface Personal {
    gender: Gender;
    age: string;
    hair: string;
    eyes: string;
    skin: string;
    description: string;
    charheight: number;
    charweight: number;
}
type Gender = 'Male' | 'Female';

export interface Program {
    name: string;
    url: string;
    programinfo: string;
    version: Version[];
}

export interface Version {
    version: string;
    primary: string;
    secondary: string;
    tertiary: string;
    build: string;
}

export interface Race {
    name: string;
    ethnicity: string;
}

export interface Save {
    name: string;
    abbr: string;
    save: number;
    base: string;
    fromattr: string;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: string;
}

export interface Spelllike {
    special: DefensiveSpecial[];
}

export interface Skill {
    name: string;
    ranks: number;
    attrbonus: string;
    attrname: Attrname;
    value: number;
    armorcheck: boolean;
    classskill: boolean;
    description: string;
    situationalmodifiers: string;
    usable: boolean;
    tools?: string;
    trainedonly?: Trainedonly;
}

export enum Attrname {
    Cha = 'CHA',
    Dex = 'DEX',
    Int = 'INT',
    Str = 'STR',
    Wis = 'WIS',
}

export enum Trainedonly {
    Yes = 'yes',
}

export interface Spellclass {
    name: string;
    maxspelllevel: number;
    spells: string;
    levels: Level[];
}

export interface Level {
    level: number;
    maxcasts: number;
    usedf: number;
}

export interface Spellsmemorized {
    name: string;
    level: string;
    class: FavoredclassEnum;
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
    componenttext: string;
    schooltext: string;
    subschooltext: Spellsubschool;
    descriptortext: string;
    savetext: string;
    resisttext: Resisttext;
    castsleft?: string;
    description: string;
    spellcomp: SpellcompElement[] | SpellcompElement;
    spellschool: string[] | string;
    spellsubschool?: Spellsubschool;
    spelldescript?: string[] | string;
    unlimited?: Trainedonly;
}

export enum Casttime {
    The1Action = '1 action',
    The1ImmediateAction = '1 immediate action',
    The1SwiftAction = '1 swift action',
}

export enum Resisttext {
    Empty = '',
    HarmlessObjectYes = 'Harmless, Object, Yes',
    No = 'No',
    ObjectYes = 'Object, Yes',
    SeeText = 'See Text',
    Yes = 'Yes',
}

export enum SpellcompElement {
    Focus = 'Focus',
    Material = 'Material',
    MaterialOrDivineFocus = 'Material or Divine Focus',
    Somatic = 'Somatic',
    Verbal = 'Verbal',
}

export enum Spellsubschool {
    Creation = 'Creation',
    Empty = '',
    Figment = 'Figment',
    Force = 'Force',
    Teleportation = 'Teleportation',
}

export interface Trackedresource {
    name: string;
    text: string;
    used: string;
    left: string;
    min: string;
    max: string;
}

export interface Trait {
    name: string;
    categorytext: string;
    description: string;
    traitcategory: string;
}

export interface Validation {
    report: string;
}

export interface Weapons {
    melee: Melee[];
    ranged: Ranged[];
}

export interface Melee {
    name: string;
    categorytext: string;
    typetext: string;
    attack: string;
    crit: string;
    damage: string;
    useradded: string;
    quantity: number;
    weight: number;
    cost: number;
    description: string;
    wepcategory: string[];
    weptype: string;
    situationalmodifiers: string;
    itempower: string;
}

export interface Ranged {
    name: string;
    categorytext: string;
    typetext: string;
    attack: string;
    crit: string;
    damage: string;
    quantity: number;
    rangedattack: Rangedattack[];
    weight: number;
    cost: number;
    description: string;
    itempower: Itempower[];
    wepcategory: string[];
    weptype: string[];
    situationalmodifiers: string;
}

export interface Rangedattack {
    attack: string;
    rangeinctext: string;
    rangeincvalue: string;
}
