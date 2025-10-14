import { CustomListener } from '@nova/listeners/CustomListener';
import { parseEnv } from '@nova/util/env';
import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes } from 'detritus-client/lib/constants';
import { setTimeout as asyncTimeout } from 'timers/promises';

@CustomListener.applyOptions({
    event: CustomListener.eventNames.GATEWAY_READY,
    emitter: 'client',
    id: 'client.gateway.ready',
    type: 'on',
    enabled: true,
})
export default class ClientGatewayReadyEvent extends CustomListener {
    async run(data: GatewayClientEvents.GatewayReady) {
        const enbaled = false;
        await this.client.setPresence({
            activities: [
                {
                    type: ActivityTypes.LISTENING,
                    name: 'your commands.',
                },
            ],
        });

        let app = this.client.application;
        if (!app) {
            app = await this.client.rest.fetchApplication(
                this.client.userId,
            );
        }

        if (!app) {
            throw app;
        }

        const guilds = app.approximateGuildCount;
        const users = app?.approximateUserInstallCount;
        this.client.logger.log(
            `${data.raw.user.username} is now ready.` +
                `Installed on ${guilds} Server(s) and ${users} user(s) `,
        );
        const existing = parseEnv();
        const channelId = '';
        if (enbaled) {
            await this.getPrinterStats();
            setInterval(async () => {
                await this.getPrinterStats();
            }, 60_000);
        }
    }

    async getPrinterStats() {
        const STATES = {
            standby: 'standby',
            printing: 'printing',
            paused: 'paused',
            complete: 'complete',
            error: 'error',
            cancelled: 'cancelled',
        } as const;
        const printers = {
            andromeda: {
                host: 'andromeda.printer',
                color: '#cdccff',
            },
            milkyway: { host: 'milkyway.printer', color: '#800045' },
            centaurus: {
                host: 'centaurus.printer',
                color: '#dead15',
            },
        } as const;
        for (const prr of Object.keys(printers)) {
            const pr = prr as keyof typeof printers;
            const printer = `http://${printers[pr].host}/printer/objects/query?print_stats`;

            const fetched = await fetch(printer);
            const ok = fetched.ok;

            if (!ok) {
                delete printers[pr];
                continue;
            }
            const data = await fetched.json();
            const state = data?.result?.status?.print_stats?.state;
            switch (state) {
                case STATES.complete:
                    console.log(`${pr} is done printing. `);
                    await this.turnOffStepper(printers[pr].host);
                    delete printers[pr];
                    break;
                case STATES.paused:
                    console.log(`${pr} paused.`);
                    break;

                case STATES.cancelled:
                    console.log(`${pr} was canceled.`);
                    await this.turnOffStepper(printers[pr].host);

                    delete printers[pr];
                    break;
                case STATES.printing:
                    break;
                case STATES.error:
                    console.log(`${pr} errored. check machine!`);
                    await this.turnOffStepper(printers[pr].host);
                    delete printers[pr];
                    break;

                default:
                    console.log(`${pr}: ${state}`);
                    break;
            }

            await asyncTimeout(1500);
        }
    }

    async turnOffStepper(printer: string) {
        return fetch(`http://${printer}/printer/gcode/script`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                script: 'M84',
            }),
        }).then((data) => data.ok);
    }
}

function hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
