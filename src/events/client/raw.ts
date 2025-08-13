import { CustomListener } from '@nova/listeners/CustomListener';
import { GatewayClientEvents } from 'detritus-client';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.RAW,
    emitter: 'client',
    id: 'client.gateway.raw',
    type: 'on',
    enabled: false,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.Raw) {
        console.log(JSON.stringify(data));
    }
}
