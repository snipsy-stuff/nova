/* eslint-disable @typescript-eslint/no-explicit-any */

import { Parser } from 'xml2js';
import { exec } from 'child_process';
import { parse } from 'path';
import {
    copyFile,
    mkdir,
    readFile,
    stat,
    writeFile,
} from 'fs/promises';
import { Logger } from '@nova/util/Logger';
import { generateRandomBase64 } from '@nova/util/Util';
import {
    CharacterCharacter,
    HerolabsClassicPorIndexFile,
} from '@nova/typings/pathfinder/por_file_internals';
import { HerolabsSheetDataPor } from '@nova/typings/pathfinder/por_file_internals/internal_sheet_data';
import { SheetData } from '@nova/typings/pathfinder/sheetdata';

export class SheetManager {
    logger = new Logger();
    parser = new Parser({ mergeAttrs: true });
    paths = {
        por: './data/por_files',
        extracted: './data/extracted',
        sheets: './data/sheets',
    };
    async get(character: string) {
        const sheets = JSON.parse(
            await readFile('./data/sheets/index.json', {
                encoding: 'utf-8',
            }),
        ) as SheetIndexData[];

        const path = sheets.find((char) => char.name === character);
        if (!path) {
            return null;
        }
        const data = JSON.parse(
            await readFile(path.path, 'utf-8'),
        ) as SheetData;

        return data;
    }

    async list() {
        await this.createIndex();
        return JSON.parse(
            await readFile('./data/sheets/index.json', {
                encoding: 'utf-8',
            }),
        ) as SheetIndexData[];
    }

    async createIndex() {
        const existing = await stat('./data/sheets/index.json')
            .then((data) => data.isFile())
            .catch(() => false);

        if (existing) return;
        return writeFile('./data/sheets/index.json', []);
    }

    async update(character: string, updated: Partial<SheetData>) {
        const old = await this.get(character);
        const sheets = await this.list();
        const indx = sheets.find((char) => char.name === character);
        if (!indx) throw 0;
        const data = {
            ...old,
            ...updated,
        };
        await writeFile(indx?.path, JSON.stringify(data, null, 2));
        return;
    }

    async create(
        filename: string,
        player: string,
    ): Promise<SheetData | null> {
        const sheets = JSON.parse(
            await readFile('./data/sheets/index.json', {
                encoding: 'utf-8',
            }),
        ) as SheetIndexData[];
        const newname = generateRandomBase64(10).replaceAll('/', '');
        await this.unzip(filename, newname);
        const index = await this.parseIndex(newname);

        const chars = index.characters;

        if (!chars.length) {
            throw new Error(
                'invalid Por File, no Characters present.',
            );
        }
        if (chars.length >= 2) {
            // ask player what to import or all
            return null;
        } else {
            const character = chars[0]?.character[0];

            if (
                sheets.find(
                    (s) =>
                        s.name === character.name &&
                        (s.player === player ||
                            s.player === character.playername),
                )
            ) {
                throw new Error('NAME_ALREADY_EXISTS');
            }
            const tosave = await this.parseCharacter(
                newname,
                character,
            );

            tosave.player = player;
            const pth = [
                this.paths.sheets,
                player,
                tosave.name,
                tosave.level,
            ].join('/');
            await mkdir(pth, { recursive: true });
            const img =
                index.characters[0]?.character[0]?.images[0]?.image[0]
                    ?.filename;
            if (img) {
                const imdir = `${this.paths.extracted}/${newname}/images/${img}`;
                tosave.image = pth + '/img.png';
                await copyFile(imdir, pth + '/img.png');
            }
            const shtdir = pth + '/sheet.json';
            await writeFile(shtdir, JSON.stringify(tosave, null, 2));
            sheets.push({
                name: tosave.name,
                path: shtdir,
                player,
                por: filename,
            });

            await writeFile(
                './data/sheets/index.json',
                JSON.stringify(sheets, null, 2),
            );

            return tosave;
        }
    }

    async parseCharacter(
        filename: string,
        char2: CharacterCharacter,
    ): Promise<SheetData> {
        const statblock = char2.statblocks[0]?.statblock[2]; // chjeck for xml
        if (!statblock) {
            throw new Error('cannot parse file.');
        }
        const file = await readFile(
            `${this.paths.extracted}/${
                filename
            }/${statblock.folder}/${statblock.filename}`,
            { encoding: 'utf-8' },
        );

        const jsonData = this.simplifyJson<HerolabsSheetDataPor>(
            await this.parser.parseStringPromise(file),
        ).document.public[0];
        const newData = {} as any;

        newData.program = this.simplifyJson(jsonData.program[0]);
        //TODO: check for multiple characters
        const char = jsonData.character[0];
        if (!char) {
            throw new Error('no character found.');
        }

        if (char.classes[0].level === '0') {
            throw new Error('NO_CLASSES');
        }
        console.log(char.classes);
        newData.name = char.name;
        newData.active = char.active === 'yes';
        newData.player = char.playername;
        newData.index = +char.characterindex;
        newData.nature = char.nature;
        newData.role = char.role;
        newData.alignment = char.alignment[0].name;
        newData.other = { templates: char.templates };
        newData.relationship = char.relationship;
        newData.type = char.type;
        newData.race = {
            name: char.race[0]?.name,
            ethnicity: char.race[0]?.ethnicity || 'None',
        };
        newData.size = +char.size[0]?.space[0]?.value; // in feet
        newData.deity = char.deity[0]?.name;
        newData.level = +char.classes[0]?.level;
        newData.classes = (char.classes[0]?.class || []).map(
            (cls) => ({
                name: cls.name,
                level: +cls.level,
                spells: cls.spells,
                casterlevel: +cls.casterlevel,
                concentrationcheck: cls.concentrationcheck,
                overcomespellresistance: cls.overcomespellresistance,
                basespelldc: +cls.basespelldc,
                castersource: cls.castersource,
                arcanespellfailure: cls.arcanespellfailure?.map(
                    (failure) => +failure.value / 100,
                ),
            }),
        );
        newData.factions = char.factions;
        newData.body = char.types[0]?.type[0]?.name;
        newData.subbodies = char.subtypes[0]?.subtype.map(
            (t) => t.name,
        );
        newData.heropoint = +char.heropoints[0]?.total;
        newData.senses = char.senses;
        newData.auras = char.auras;
        if (char.favoredclasses) {
            newData.favoredclass =
                char.favoredclasses[0]?.favoredclass[0]?.name;
        }
        newData.health = char.health.map((entry) => {
            const cleanedEntry: Record<string, string | number> = {};
            for (const [key, value] of Object.entries(entry)) {
                if (/^[0-9]+$/.test(value)) {
                    cleanedEntry[key] = Number(value); // convert valid numeric strings
                } else {
                    cleanedEntry[key] = value; // keep other strings unchanged
                }
            }
            return cleanedEntry;
        })[0];
        newData.xp = +char.xp[0]?.total;
        newData.money = char.money.map((entry) => {
            const cleanedEntry: Record<string, string | number> = {};
            for (const [key, value] of Object.entries(entry)) {
                if (/^[0-9]+$/.test(value)) {
                    cleanedEntry[key] = Number(value); // convert valid numeric strings
                } else {
                    cleanedEntry[key] = value; // keep other strings unchanged
                }
            }
            return cleanedEntry;
        })[0];

        newData.personal = char.personal[0];
        newData.personal.charheight = convertInchesTofeet(
            +char.personal[0]?.charheight[0]?.value,
        );
        newData.personal.charweight =
            +char.personal[0]?.charweight[0]?.value;
        newData.languages = char.languages[0]?.language.map(
            (l) => l.name,
        );
        newData.attributes = char.attributes[0]?.attribute.map(
            (at) => ({
                name: at.name,
                value: at.attrvalue[0],
                situationalmodifiers: at.situationalmodifiers.map(
                    (m) => ({
                        name: m.text,
                        modifiers: m.situationalmodifier?.map(
                            (s) => ({ data: s.text, name: s.source }),
                        ),
                    }),
                ),
                bonus: at.attrbonus[0],
            }),
        );

        newData.saves = char.saves[0]?.save.map((at) => ({
            name: at.name,
            abbr: at.abbr,
            save: +at.save,
            base: at.base,
            fromattr: at.fromattr,
            fromresist: at.fromresist,
            frommisc: '',
            situationalmodifiers: at.situationalmodifiers
                .map((m) => m.text)
                .join(', '),
        }));

        newData.allsaves = char.saves[0]?.allsaves.map((save) => ({
            save: +save.save,
            base: +save.base,
            fromresist: save.fromresist,
            frommisc: save.frommisc,
            situationalmodifiers: save.situationalmodifiers
                .map((m) => m.text)
                .join(', '),
        }));
        if (Array.isArray(char.defensive)) {
            newData.defensive = char.defensive.map((def) => {
                // Defensive expects { special: DefensiveSpecial }
                // If def.special is an array, take the first element or handle accordingly
                return {
                    special: Array.isArray(def.special)
                        ? def.special[0]
                        : def.special,
                };
            });
        } else {
            newData.defensive = [];
        }
        if (Array.isArray(char.damagereduction)) {
            newData.damagereduction = char.damagereduction.map(
                (def) => {
                    const data: Record<string, any> = {};
                    for (const key of Object.keys(def)) {
                        data[key] = [];
                        for (const entry of def[key as 'special']) {
                            data[key] = entry;
                        }
                    }
                    return data;
                },
            );
        } else {
            newData.damagereduction = [];
        }
        if (Array.isArray(char.immunities)) {
            newData.immunities = char.immunities.map((def) => {
                const data: Record<string, any> = {};
                for (const key of Object.keys(def)) {
                    data[key] = [];
                    for (const entry of def[key as 'special']) {
                        data[key] = entry;
                    }
                }
                return data;
            });
        } else {
            newData.immunities = [];
        }

        if (Array.isArray(char.resistances)) {
            newData.resistances = char.resistances.map((def) => {
                const data: Record<string, any> = {};
                for (const key of Object.keys(def)) {
                    data[key] = [];
                    for (const entry of def[key as 'special']) {
                        data[key] = entry;
                    }
                }
                return data;
            });
        } else {
            newData.resistances = [];
        }
        newData.weaknesses = this.simplifyJson(char.weaknesses);
        newData.armorclass = char.armorclass[0];
        newData.penalties = char.penalties[0]?.penalty;
        newData.maneuvers = char.maneuvers;
        newData.initiative = char.initiative[0];
        newData.movement = {
            speed: +char.movement[0]?.speed[0]?.value,
            base: +char.movement[0]?.basespeed[0]?.value,
        };

        newData.encumbrance = char.encumbrance[0];

        newData.skills = char.skills[0]?.skill.map((skill) => ({
            ...skill,
            name: skill.name,
            ranks: +skill.ranks,
            attrbonus: skill.attrbonus,
            attrname: skill.attrname,
            value: +skill.value,
            armorcheck: skill.armorcheck === 'yes',
            classskill: skill.classskill === 'yes',
            description: skill.description,
            situationalmodifiers: skill.situationalmodifiers.map(
                (m) => m.text,
            ),
            tools: skill.tools,
            trainedonly: skill.trainedonly,
            usable: skill.usable === 'yes',
        }));
        newData.skillabilities = char.skillabilities;
        newData.feats = char.feats[0]?.feat.map((feat) => ({
            ...feat,
            name: feat.name,
            categorytext: feat.categorytext,
            profgroup: feat.profgroup === 'yes',
            useradded: feat.useradded === 'no',
            description: feat.description,
            featcategory: feat.featcategory,
        }));
        newData.traits = char.traits[0]?.trait.map((trait) => ({
            ...trait,
            name: trait.name,
            categorytext: trait.categorytext,
            description: trait.description,
            traitcategory: trait.traitcategory,
        }));

        newData.flaws = char.flaws[0]?.flaw.map((flaw) => ({
            ...flaw,
            name: flaw.name,
            description: flaw.description,
        }));

        newData.skilltricks = char.skilltricks;
        newData.animaltricks = char.animaltricks;

        newData.attack = char.attack.map((attack) =>
            this.simplifyJson(attack),
        );
        newData.weapons = {
            melee: [],
            ranged: [],
        };

        for (const melee of char.melee) {
            for (const weapon of melee.weapon) {
                newData.weapons.melee.push({
                    name: weapon.name,
                    categorytext: weapon.categorytext,
                    typetext: weapon.typetext,
                    attack: weapon.attack,
                    crit: weapon.crit,
                    damage: weapon.damage,
                    useradded: weapon.useradded,
                    quantity: +weapon.quantity,
                    weight: +weapon.weight?.[0]?.value,
                    cost: +weapon.cost?.[0]?.value,
                    description: weapon.description,
                    wepcategory: weapon.wepcategory,
                    weptype: weapon.weptype,
                    situationalmodifiers:
                        weapon.situationalmodifiers?.map(
                            (m) => m.text,
                        ),

                    itempower: '',
                });
            }
        }
        for (const ranged of char.ranged) {
            for (const weapon of ranged.weapon) {
                newData.weapons.ranged.push({
                    name: weapon.name,
                    categorytext: weapon.categorytext,
                    typetext: weapon.typetext,
                    attack: weapon.attack,
                    crit: weapon.crit,
                    damage: weapon.damage,
                    quantity: +weapon.quantity,
                    rangedattack: weapon.rangedattack,
                    weight: +weapon.weight?.[0]?.value,
                    cost: +weapon.cost?.[0]?.value,
                    description: weapon.description,
                    itempower: weapon.itempower,
                    wepcategory: weapon.wepcategory,
                    weptype: weapon.weptype,
                    situationalmodifiers:
                        weapon.situationalmodifiers?.map(
                            (m) => m.text,
                        ),
                });
            }
        }
        newData.defenses = { armor: [] };
        for (const def of char.defenses) {
            const keys = Object.keys(def);
            for (const key of keys) {
                if (!newData.defenses[key as 'armor'])
                    newData.defenses[key as 'armor'] = [];
                for (const armor of def[key as 'armor']) {
                    newData.defenses[key as 'armor'].push({
                        name: armor.name,
                        ac: armor.ac,
                        equipped: armor.equipped === 'yes',
                        natural: armor.natural === 'yes',
                        useradded: armor.useradded === 'yes',
                        quantity: +armor.quantity,
                        weight: +armor.weight?.[0]?.value,
                        cost: +armor.cost?.[0]?.value,
                        description: armor.description,
                    });
                }
            }
        }

        newData.items = { magic: [] };

        for (const items of char.magicitems) {
            if (!items) continue;
            const keys = Object.keys(items);

            for (const key of keys) {
                if (!newData.items[key]) newData.items[key] = [];
                for (const item of items[key as 'item']) {
                    newData.items[key].push({
                        name: item.name,
                        quantity: +item.quantity,
                        weight: +item.weight?.[0]?.value,
                        cost: +item.cost?.[0]?.value,
                        description: item.description,
                        itemslot: item.itemslot,
                        itempower: item.itempower,
                    });
                }
            }
        }

        newData.gear = [];
        for (const { item: items } of char.gear) {
            for (const item of items) {
                newData.gear.push({
                    name: item.name,
                    quantity: +item.quantity,
                    weight: +item.weight?.[0]?.value,
                    cost: +item.cost?.[0]?.value,
                    description: item.description,
                });
            }
        }

        newData.spelllike = char.spelllike[0];

        newData.trackedresources = [];

        for (const res of char.trackedresources) {
            for (const r2 of res.trackedresource) {
                newData.trackedresources.push({
                    name: r2.name,
                    text: r2.text,
                    used: r2.used,
                    left: r2.left,
                    min: r2.min,
                    max: r2.max,
                });
            }
        }

        newData.specials = [];

        for (const special of char.otherspecials) {
            for (const key of Object.keys(special)) {
                for (const spec of special[key as 'special']) {
                    newData.specials.push({
                        name: spec.name,
                        shortname: spec.shortname,
                        description: spec.description,
                        type: spec.type,
                        sourcetext: spec.sourcetext,
                        specsource: spec.specsource,
                    });
                }
            }
        }

        newData.spellsknown = char.spellsknown;

        newData.spellsmemorized = [];

        for (const spells of char.spellsmemorized) {
            for (const spell of spells.spell) {
                newData.spellsmemorized.push({
                    name: spell.name,
                    level: spell.level,
                    class: spell.class,
                    casttime: spell.casttime,
                    range: spell.range,
                    target: spell.target,
                    area: spell.area,
                    effect: spell.effect,
                    duration: spell.duration,
                    save: spell.save,
                    resist: spell.resist,
                    dc: spell.dc,
                    casterlevel: spell.casterlevel,
                    componenttext: spell.componenttext,
                    schooltext: spell.schooltext,
                    subschooltext: spell.subschooltext,
                    descriptortext: spell.descriptortext,
                    savetext: spell.savetext,
                    resisttext: spell.resisttext,
                    castsleft: spell.castsleft,
                    description: spell.description,
                    spellcomp: spell.spellcomp,
                    spellschool: spell.spellschool,
                    spellsubschool: spell.spellsubschool,
                    spelldescript: spell.spelldescript,
                    unlimited: spell.unlimited,
                });
            }
        }

        newData.spellbook = char.spellbook;
        newData.spellclasses = [];
        for (const spellclass of char.spellclasses) {
            for (const cls of spellclass.spellclass) {
                newData.spellclasses.push({
                    name: cls.name,
                    maxspelllevel: +cls.maxspelllevel,
                    spells: cls.spells,
                    levels: cls.spelllevel.map((l) => ({
                        level: +l.level,
                        maxcasts: +l.maxcasts,
                        usedf: +l.used,
                    })),
                });
            }
        }

        newData.journals = [];

        for (const ad of char.journals) {
            for (const journal of ad.journal) {
                newData.journals.push({
                    name: journal.name,
                    gamedate: journal.gamedate,
                    realdate: journal.realdate,
                    xp: journal.xp,
                    pp: journal.pp,
                    gp: journal.gp,
                    sp: journal.sp,
                    cp: journal.cp,
                    cn1: journal.cn1,
                    cn2: journal.cn2,
                    cn3: journal.cn3,
                    cn4: journal.cn4,
                    prestigeaward: journal.prestigeaward,
                    prestigespend: journal.prestigespend,
                    description: journal.description,
                });
            }
        }

        newData.validation = char.validation;
        newData.settings = char.settings;
        newData.minions = char.minions;

        return this.simplifyJson(newData);
    }

    async parseIndex(
        name: string,
    ): Promise<HerolabsClassicPorIndexFile['document']> {
        const indexfile =
            this.paths.extracted + '/' + name + '/index.xml';

        const data = await this.parser.parseStringPromise(
            await readFile(indexfile, { encoding: 'utf-8' }),
        );
        return this.simplifyJson(
            data.document,
        ) as unknown as HerolabsClassicPorIndexFile['document'];
    }

    // async parseCharacters(character: CharacterCharacter[]) {}

    simplifyJson<T>(obj: unknown): T {
        if (typeof obj !== 'object' || obj === null) return obj as T;
        if (
            Array.isArray(obj) &&
            obj.length === 1 &&
            typeof obj[0] === 'string'
        ) {
            return obj[0] as T; // Convert single-string arrays to just the string
        }
        if (typeof obj === 'string' && /\d+/.test(obj)) {
            return +obj as T;
        }

        if (Array.isArray(obj)) {
            return obj.map((ob) => this.simplifyJson(ob)) as T;
        }

        const newObj: Record<string, unknown> = {};
        for (const key in obj as Record<string, unknown>) {
            newObj[key] = this.simplifyJson(
                (obj as Record<string, unknown>)[key],
            );
        }
        return newObj as T;
    }

    async unzip(filename: string, newname = parse(filename).name) {
        return new Promise((res, rej) => {
            return exec(
                `unzip ${filename} -d ${this.paths.extracted}/${newname}`,
                (err, stdout, stderr) => {
                    if (err || stderr) {
                        return rej(err || stderr);
                    }
                    return res(stdout);
                },
            );
        });
    }
}
function convertInchesTofeet(inches: number): string {
    return `${Math.floor(inches / 12)}'${inches % 12}"`;
}

interface SheetIndexData {
    name: string;
    path: string;
    player: string;
    por: string;
}
