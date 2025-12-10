import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommandOption } from 'detritus-client/lib/interaction';

export class NumberOption extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.NUMBER,
        });
    }
}
