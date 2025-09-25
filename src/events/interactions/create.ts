import { CustomListener } from '@nova/listeners/CustomListener';

@CustomListener.applyOptions({
    emitter: 'client',
    event: CustomListener.eventNames.INTERACTION_CREATE,
    id: 'client.interaction.create',
    type: 'on',
    enabled: true,
})
export default class InteractionCreateListener extends CustomListener {
    run() {
        /* */
    }
}
