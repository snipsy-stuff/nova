export interface HerolabsClassicPorIndexFile {
    document: HerolabClassicPorindexDocument;
}

export interface HerolabClassicPorindexDocument {
    signature: string;
    game: Game[];
    program: Program[];
    handlers: DocumentHandler[];
    characters: DocumentCharacter[];
}

export interface DocumentCharacter {
    character: CharacterCharacter[];
}

export interface CharacterCharacter {
    name: string;
    summary: string;
    isally: string;
    allegianceid: string;
    allegiancename: string;
    playername: string;
    herolableadindex: string;
    characterindex: string;
    statblocks: CharacterStatblock[];
    images: CharacterImage[];
}

export interface CharacterImage {
    image: ImageImage[];
}

export interface ImageImage {
    filename: string;
    folder: string;
}

export interface CharacterStatblock {
    statblock: StatblockStatblock[];
}

export interface StatblockStatblock {
    format: string;
    folder: string;
    filename: string;
}

export interface Game {
    name: string;
    folder: string;
    publisher: string;
    url: string;
    gameinfo: string;
    version: Version[];
}

export interface Version {
    version: string;
    primary: string;
    secondary: string;
    tertiary: string;
    build: string;
}

export interface DocumentHandler {
    handler: HandlerHandler[];
}

export interface HandlerHandler {
    name: string;
    folder: string;
}

export interface Program {
    name: string;
    url: string;
    programinfo: string;
    version: Version[];
}
