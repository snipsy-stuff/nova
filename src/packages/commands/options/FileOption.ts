import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import {
    InteractionCommandOption,
    InteractionContext,
} from 'detritus-client/lib/interaction';
import { Attachment } from 'detritus-client/lib/structures';

export class FileOption extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.ATTACHMENT,
        });
    }

    filter(
        fn: (value: Attachment, ctx: InteractionContext) => boolean,
    ) {
        this.value = fn;
        return this;
    }
}
