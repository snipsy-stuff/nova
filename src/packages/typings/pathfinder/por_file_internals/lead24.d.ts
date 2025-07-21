export interface HerolabsClassicLead24File {
    document: Document;
}

export interface Document {
    signature: string;
    hero: Hero[];
}

export interface Hero {
    playername: string;
    nextimage: string;
    heroindex: string;
    herosummary: string;
    heroname: string;
    activemode: string;
    allegianceid: string;
    hasacted: Hasacted;
    batchindex: string;
    userbatch: string;
    enmassebatch: string;
    nexttrade: string;
    nexttransact: string;
    poolcount: string;
    focustab: string;
    container: HeroContainer[];
    source: SourceElement[];
    needsource: HeroNeedsource[];
    requiredsources: Requiredsource[];
    userimage: Userimage[];
}

export interface HeroContainer {
    index: string;
    pickcount: string;
    pick: PurplePick[];
}

export interface PurplePick {
    thing: string;
    index: string;
    batchindex: string;
    refcount?: string;
    fieldcount?: string;
    chain?: Chain[];
    field?: Field[];
    bootstrap?: Bootstrap;
    foreign?: Bootstrap;
    reference?: (ReferenceClass | string)[] | string;
    uniqueness?: Uniqueness;
    source?: string;
    root?: Hasacted;
    default?: Bootstrap;
    tablelinkid?: Agentid;
    agentid?: Agentid;
    secondary?: Bootstrap;
    gizmo?: Gizmo[];
    count?: string;
    live?: Hasacted;
    basislink?: string;
}

export enum Agentid {
    CFGMagTail = 'cfgMagTail',
    CHelpEKn = 'cHelpEKn',
    CHelpMag = 'cHelpMag',
}

export enum Bootstrap {
    Yes = 'yes',
}

export interface Chain {
    index: string;
}

export interface Field {
    id: string;
    user?: string;
    value?: string;
    arrayvalue?: Arrayvalue[];
    menuthing?: string;
    text?: string;
    ispick?: Bootstrap;
    menuusage?: Menuusage;
    cacheindex?: string;
}

export interface Arrayvalue {
    index: string;
    value: string;
    column?: string;
}

export enum Menuusage {
    Container = 'container',
    Hero = 'hero',
}

export interface Gizmo {
    id: string;
    container: GizmoContainer[];
}

export interface GizmoContainer {
    index: string;
    pickcount: string;
    pick: FluffyPick[];
}

export interface FluffyPick {
    thing: string;
    index: string;
    batchindex: string;
    uniqueness?: Uniqueness;
    refcount?: string;
    source?: SourceEnum;
    default?: Bootstrap;
    fieldcount?: string;
    bootstrap?: Bootstrap;
    chain?: Chain[];
    reference?: ReferenceClass[];
    field?: Field[];
    root?: Hasacted;
    agentid?: Agentid;
}

export interface ReferenceClass {
    bootindex: string;
    pickindex?: string;
    batchindex?: string;
}

export enum Hasacted {
    No = 'no',
}

export enum SourceEnum {
    DynSpec = 'DynSpec',
    FoRace = 'foRace',
    LiAbility = 'liAbility',
    SPBookTab1 = 'spBookTab1',
    WMagChoose = 'wMagChoose',
    WMagMat = 'wMagMat',
    WMagSpec = 'wMagSpec',
}

export enum Uniqueness {
    Unique = 'unique',
    Useronce = 'useronce',
}

export interface HeroNeedsource {
    source: string;
    name: string;
}

export interface Requiredsource {
    picksources: Picksource[];
}

export interface Picksource {
    pickinfo: Pickinfo[];
    needsource: PicksourceNeedsource[];
}

export interface PicksourceNeedsource {
    source: string;
    name: string;
    ismodifyonly?: Bootstrap;
}

export interface Pickinfo {
    thingid: string;
    thingname: string;
    important?: Bootstrap;
}

export interface SourceElement {
    source: string;
    name: string;
    count: string;
}

export interface Userimage {
    imageindex: string;
    filename: string;
    imagefile: string;
}
