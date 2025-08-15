import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import {
    InteractionCommandOption,
    InteractionCommandOptionOptions,
} from 'detritus-client/lib/interaction';

export class ChannelOption extends InteractionCommandOption {
    constructor(data?: InteractionCommandOptionOptions) {
        super({
            ...data,
            type: ApplicationCommandOptionTypes.CHANNEL,
        });
    }
}
