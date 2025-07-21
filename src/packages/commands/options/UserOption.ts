import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommandOption } from 'detritus-client/lib/interaction';

export class UserOption extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.USER,
        });
    }
}
