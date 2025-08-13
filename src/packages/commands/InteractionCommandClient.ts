import { CustomListener } from '@nova/listeners/CustomListener';
import { InteractionCommandClient } from 'detritus-client';

export class NovaInteractionCommandClient extends InteractionCommandClient {
    async addMultipleIn(
        directory: string,
        options?: { isAbsolute?: boolean; subdirectories?: boolean },
    ): Promise<this> {
        await super.addMultipleIn(directory, options);

        for (const command of this.commands) {
            this.emit(CustomListener.eventNames.COMMAND_LOAD, {
                command,
            });
        }

        return this;
    }
}
