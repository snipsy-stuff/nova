import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommandOption } from 'detritus-client/lib/interaction';

export class BooleanOption extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.BOOLEAN,
        });
    }
}
