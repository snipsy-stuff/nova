export interface HerolabsClassicPortfolioFile {
    document: Document;
}

export interface Document {
    signature: string;
    product: Product[];
    game: Game[];
    portfolio: Portfolio[];
}

export interface Game {
    folder: string;
    game: string;
    major: string;
    minor: string;
}

export interface Portfolio {
    herocount: string;
    activehero: string;
    tactical: Tactical[];
    notes: string;
    hero: Hero[];
    deffield: Deffield[];
}

export interface Deffield {
    id: string;
    text?: string;
}

export interface Hero {
    playername: string;
    heroindex: string;
    herosummary: string;
    leadfile: string;
    heroname: string;
    activemode: string;
    allegianceid: string;
    hasacted: string;
    needsource: HeroNeedsource[];
    requiredsources: Requiredsource[];
    userimage: Userimage[];
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
    ismodifyonly?: Ismodifyonly;
}

export enum Ismodifyonly {
    Yes = 'yes',
}

export interface Pickinfo {
    thingid: string;
    thingname: string;
    important?: Ismodifyonly;
}

export interface Userimage {
    imageindex: string;
    filename: string;
    imagefile: string;
}

export interface Tactical {
    combatturn: string;
}

export interface Product {
    major: string;
    minor: string;
    patch: string;
    build: string;
}
