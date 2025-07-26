import { GameManager } from '../GameManager';
import { SheetManager } from './SheetManager';

export class Pathfinder {
    sheets = new SheetManager();
    constructor(public readonly manager: GameManager) {}
}
