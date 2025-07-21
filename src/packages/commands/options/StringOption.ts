import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommandOption } from 'detritus-client/lib/interaction';

export class StringOption extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.STRING,
        });
    }
}
