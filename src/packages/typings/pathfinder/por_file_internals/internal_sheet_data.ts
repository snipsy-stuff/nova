export interface HerolabsSheetDataPor {
    document: Document;
}

export interface Document {
    public: Public[];
}

export interface Public {
    program: Program[];
    localization: Localization[];
    character: Character[];
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
    race: Race[];
    alignment: Alignment[];
    templates: Setting[];
    size: Size[];
    deity: Alignment[];
    challengerating: Challengerating[];
    xpaward: Challengerating[];
    classes: CharacterClass[];
    factions: string;
    types: TypeElement[];
    subtypes: Subtype[];
    heropoints: Heropoint[];
    senses: Defensive[];
    auras: string;
    favoredclasses: Favoredclass[];
    health: Health[];
    xp: Heropoint[];
    money: Money[];
    personal: Personal[];
    languages: CharacterLanguage[];
    attributes: CharacterAttribute[];
    saves: CharacterSave[];
    defensive: Defensive[];
    damagereduction: Damagereduction[];
    immunities: Defensive[];
    resistances: Otherspecial[];
    weaknesses: string;
    armorclass: Armorclass[];
    penalties: CharacterPenalty[];
    maneuvers: Maneuver[];
    initiative: Initiative[];
    movement: Movement[];
    encumbrance: Encumbrance[];
    skills: CharacterSkill[];
    skillabilities: string;
    feats: CharacterFeat[];
    traits: CharacterTrait[];
    flaws: CharacterFlaw[];
    skilltricks: string;
    animaltricks: string;
    attack: Attack[];
    melee: Melee[];
    ranged: Ranged[];
    defenses: Defense[];
    magicitems: Magicitem[];
    gear: Gear[];
    spelllike: Defensive[];
    trackedresources: CharacterTrackedresource[];
    otherspecials: Otherspecial[];
    spellsknown: string;
    spellsmemorized: Spellsmemorized[];
    spellbook: string;
    spellclasses: CharacterSpellclass[];
    journals: CharacterJournal[];
    images: CharacterImage[];
    validation: Validation[];
    settings: Setting[];
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
    type?: TypeEnum;
    sourcetext?: string;
    description: string;
    specsource?: string[] | string;
}

export enum TypeEnum {
    ExtraordinaryAbility = 'Extraordinary Ability',
    ExtraordinaryAbilitySupernaturalAbility = 'Extraordinary Ability, Supernatural Ability',
    SpellLikeAbility = 'Spell-Like Ability',
    SupernaturalAbility = 'Supernatural Ability',
}

export interface CharacterAttribute {
    attribute: AttributeAttribute[];
}

export interface AttributeAttribute {
    name: string;
    attrvalue: Attr[];
    attrbonus: Attr[];
    situationalmodifiers: AttributeSituationalmodifier[];
}

export interface Attr {
    text: string;
    base: string;
    modified: string;
}

export interface AttributeSituationalmodifier {
    text: string;
    situationalmodifier?: SituationalmodifierSituationalmodifier[];
}

export interface SituationalmodifierSituationalmodifier {
    text: string;
    source: string;
}

export interface Challengerating {
    value: string;
    text: string;
}

export interface CharacterClass {
    level: string;
    summary: string;
    summaryabbr: string;
    class: ClassClassClass[];
}

export interface ClassClassClass {
    name: string;
    level: string;
    spells: string;
    casterlevel: string;
    concentrationcheck: string;
    overcomespellresistance: string;
    basespelldc: string;
    castersource: string;
    arcanespellfailure?: Challengerating[];
}

export interface Damagereduction {
    special: DamagereductionSpecial[];
}

export interface DamagereductionSpecial {
    name: string;
    shortname: string;
    description: string;
}

export interface Defense {
    armor: Armor[];
}

export interface Armor {
    name: string;
    ac: string;
    equipped: Active;
    natural: Active;
    useradded: string;
    quantity: string;
    weight: Challengerating[];
    cost: Challengerating[];
    description: string;
}

export interface Defensive {
    special: DefensiveSpecial[];
}

export interface DefensiveSpecial {
    name: string;
    shortname: string;
    type?: TypeEnum;
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

export interface Favoredclass {
    favoredclass: Alignment[];
}

export interface CharacterFeat {
    feat: FeatFeat[];
}

export interface FeatFeat {
    name: string;
    categorytext: Categorytext;
    profgroup?: Active;
    useradded?: string;
    description: string;
    featcategory?: string[] | Categorytext;
}

export enum Categorytext {
    Combat = 'Combat',
    CombatCombatStyle = 'Combat, Combat Style',
    Empty = '',
    Mythic = 'Mythic',
}

export interface CharacterFlaw {
    flaw: FlawFlaw[];
}

export interface FlawFlaw {
    name: string;
    description: string;
}

export interface Gear {
    item: GearItem[];
}

export interface GearItem {
    name: string;
    quantity: string;
    weight: Challengerating[];
    cost: Challengerating[];
    description: string;
}

export interface Health {
    hitdice: string;
    hitpoints: string;
    damage: string;
    nonlethal: string;
    currenthp: string;
}

export interface Heropoint {
    total: string;
}

export interface CharacterImage {
    image: ImageImage[];
}

export interface ImageImage {
    filename: string;
}

export interface Initiative {
    total: string;
    attrtext: string;
    misctext: string;
    attrname: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface CharacterJournal {
    journal: JournalJournal[];
}

export interface JournalJournal {
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

export interface CharacterLanguage {
    language: LanguageLanguage[];
}

export interface LanguageLanguage {
    name: string;
    useradded?: string;
}

export interface Magicitem {
    item: MagicitemItem[];
}

export interface MagicitemItem {
    name: string;
    quantity: string;
    weight: Challengerating[];
    cost: Challengerating[];
    description: string;
    itemslot?: string;
    itempower?: Itempower[];
}

export interface Itempower {
    name: string;
    pricebonusvalue: string;
    pricebonustext: string;
    pricecashvalue: string;
    pricecashtext: string;
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

export interface Melee {
    weapon: MeleeWeapon[];
}

export interface MeleeWeapon {
    name: string;
    categorytext: string;
    typetext: string;
    attack: string;
    crit: string;
    damage: string;
    useradded: string;
    quantity: string;
    weight: Challengerating[];
    cost: Challengerating[];
    description: string;
    wepcategory: string[];
    weptype: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
    itempower?: Itempower[];
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
    speed: Challengerating[];
    basespeed: Challengerating[];
}

export interface Otherspecial {
    special: AttackSpecial[];
}

export interface CharacterPenalty {
    penalty: PenaltyPenalty[];
}

export interface PenaltyPenalty {
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
    charheight: Challengerating[];
    charweight: Challengerating[];
}

export interface Race {
    racetext: string;
    name: string;
    ethnicity: string;
}

export interface Ranged {
    weapon: RangedWeapon[];
}

export interface RangedWeapon {
    name: string;
    categorytext: string;
    typetext: string;
    attack: string;
    crit: string;
    damage: string;
    quantity: string;
    rangedattack: Rangedattack[];
    weight: Challengerating[];
    cost: Challengerating[];
    description: string;
    itempower: Itempower[];
    wepcategory: string[];
    weptype: string[];
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface Rangedattack {
    attack: string;
    rangeinctext: string;
    rangeincvalue: string;
}

export interface CharacterSave {
    save: SaveSave[];
    allsaves: Allsave[];
}

export interface Allsave {
    save: string;
    base: string;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: AttributeSituationalmodifier[];
}

export interface SaveSave {
    name: string;
    abbr: string;
    save: string;
    base: string;
    fromattr: string;
    fromresist: string;
    frommisc: string;
    situationalmodifiers: ArmorclassSituationalmodifier[];
}

export interface Setting {
    summary: string;
}

export interface Size {
    name: string;
    space: Challengerating[];
    reach: Challengerating[];
}

export interface CharacterSkill {
    skill: SkillSkill[];
}

export interface SkillSkill {
    name: string;
    ranks: string;
    attrbonus: string;
    attrname: Attrname;
    value: string;
    armorcheck?: Active;
    classskill?: Active;
    description: string;
    situationalmodifiers: AttributeSituationalmodifier[];
    tools?: string;
    trainedonly?: Active;
    usable?: string;
}

export enum Attrname {
    Cha = 'CHA',
    Dex = 'DEX',
    Int = 'INT',
    Str = 'STR',
    Wis = 'WIS',
}

export interface CharacterSpellclass {
    spellclass: SpellclassSpellclass[];
}

export interface SpellclassSpellclass {
    name: string;
    maxspelllevel: string;
    spells: string;
    spelllevel: Spelllevel[];
}

export interface Spelllevel {
    level: string;
    maxcasts: string;
    used: string;
}

export interface Spellsmemorized {
    spell: Spell[];
}

export interface Spell {
    name: string;
    level: string;
    class: ClassEnum;
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
    unlimited?: Active;
}

export enum Casttime {
    The1Action = '1 action',
    The1ImmediateAction = '1 immediate action',
    The1SwiftAction = '1 swift action',
}

export enum ClassEnum {
    Magus = 'Magus',
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

export interface Subtype {
    subtype: Alignment[];
}

export interface CharacterTrackedresource {
    trackedresource: TrackedresourceTrackedresource[];
}

export interface TrackedresourceTrackedresource {
    name: string;
    text: string;
    used: string;
    left: string;
    min: string;
    max: string;
}

export interface CharacterTrait {
    trait: TraitTrait[];
}

export interface TraitTrait {
    name: string;
    categorytext: string;
    description: string;
    traitcategory: string;
}

export interface TypeElement {
    type: Alignment[];
}

export interface Validation {
    report: string;
}

export interface Localization {
    language: string;
    units: string;
}

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
