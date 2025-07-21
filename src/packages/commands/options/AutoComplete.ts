import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import {
    InteractionAutoCompleteContext,
    InteractionCommandOption,
} from 'detritus-client/lib/interaction';

export class AutoComplete extends InteractionCommandOption {
    constructor() {
        super({
            type: ApplicationCommandOptionTypes.STRING,
            autocomplete: true,
        });
    }

    addAutoComplete(
        fn: (ctx: InteractionAutoCompleteContext) => Promise<unknown>,
    ) {
        this.onAutoComplete = fn;
        return this;
    }
}
