import { CustomListener } from '@nova/listeners/CustomListener';
import { parseEnv } from '@nova/util/env';
import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { Embed } from 'detritus-client/lib/utils';
// import { copyFileSync } from 'node:fs';
// import { setInterval } from 'node:timers/promises';
@CustomListener.applyOptions({
    event: CustomListener.eventNames.GATEWAY_READY,
    emitter: 'client',
    id: 'client.gateway.ready',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.GatewayReady) {
        // const ac = new AbortController();
        this.client.logger.log(
            `${data.raw.user.username} is now ready.`,
        );
        await this.client.setPresence({
            activities: [
                {
                    type: ActivityTypes.LISTENING,
                    name: 'your commands.',
                },
            ],
        });

        const existing = parseEnv();
        if (existing.BOOT_LOG_CHANNEL) {
            const channel = this.client.channels.get(
                existing.BOOT_LOG_CHANNEL,
            ) as ChannelGuildText;
            if (channel) {
                const embed = new Embed().setDescription(`booted.`);

                await channel
                    .createMessage({ embeds: [embed] })
                    .catch(console.error);
            }
        }

        // const channel = this.client.channels.get(
        //     '1399320995403399268',
        // ) as ChannelGuildText;
        // let isdone = false;
        // async function getImage() {
        //     const api = await fetch(
        //         'http://192.168.0.178/webcam/?action=snapshot&cacheBust=1753694471799',
        //     );

        //     const buff = Buffer.from(await api.arrayBuffer());
        //     return buff;
        // }

        // const msg = await channel.createMessage({
        //     files: [
        //         {
        //             value: await getImage(),
        //             contentType: 'image/jpeg',
        //             filename: 'image.jpeg',
        //         },
        //     ],
        // });
        // try {
        //     for await (const _ of setInterval(10_000, null, {
        //         signal: ac.signal,
        //     })) {
        // const donePrinting = await fetch(
        //     'http://192.168.0.178/printer/objects/query?print_stats',
        //     {
        //         body: JSON.stringify({
        //             api_key: '7375636b206974206e657264',
        //         }),
        //     },
        // ).then((data) => data.json());
        //         if (isdone) {
        //             ac.abort();
        //             break;
        //         }
        //         console.log('updating..');
        //         await msg
        //             .edit({
        //                 files: [
        //                     {
        //                         value: await getImage(),
        //                         contentType: 'image/jpeg',
        //                         filename: 'image.jpeg',
        //                     },
        //                 ],
        //             })
        //             .catch(() => {
        //                 isdone = true;
        //             });
        //         if (
        //             donePrinting?.result?.status?.print_stats
        //                 ?.state !== 'printing'
        //         ) {
        //             console.log('done printing.');
        //             isdone = true;
        //         }
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
    }
}
