/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { CustomListener } from '@nova/listeners/CustomListener';
import { GuildSetings } from '@nova/typings/db/settings.guilds';
import { defaultSettings } from '@nova/util/Constants';
import { GatewayClientEvents } from 'detritus-client';
import { ActivityTypes } from 'detritus-client/lib/constants';
import { ChannelGuildText } from 'detritus-client/lib/structures';
import { setTimeout as asyncTimeout } from 'timers/promises';

const possibleSTatuses = [
    {
        type: ActivityTypes.LISTENING,
        name: 'your Commands.',
    },
    {
        type: ActivityTypes.LISTENING,
        name: 'daddy',
    },
    {
        type: ActivityTypes.LISTENING,
        name: '\u200b',
    },
];

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
                possibleSTatuses[
                    Math.floor(
                        Math.random() * possibleSTatuses.length,
                    )
                ],
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
        this.client.logger.debug(
            `Following events are loaded:\n${this.handler.modules.map((m) => m.id).join(',\n')}`,
            'INIT_CLIENT_LOAD',
        );

        const botGuilds = this.client.guilds.map((guild) => guild.id);
        const toSave: GuildSetings[] = [];
        if (this.client.db.db) {
            const col = this.client.db.guilds;
            const guildSettings = await col.find({}).toArray();

            for (const guild of botGuilds) {
                const existing = guildSettings.find(
                    (g) => g.guildId === guild,
                );
                if (!existing) {
                    toSave.push({
                        ...defaultSettings,
                        guildId: guild,
                    });
                }
            }
            if (toSave.length) {
                await col.insertMany(toSave);
            }
        }
        const guilds = app.approximateGuildCount;
        const users = app.approximateUserInstallCount;
        this.client.logger.log(
            `${data.raw.user.username} is now ready.` +
                `Installed on ${guilds} Server(s) and ${users} user(s) `,
        );
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

            const channel = '1408764370665607243';

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
                    if (pr !== 'milkyway') break;
                    const currentImg = await fetch(
                        'http://milkyway.printer/webcam/?action=snapshot',
                    );
                    const { total_layer, current_layer } =
                        data.result.status.print_stats.info;
                    await (
                        this.client.channels.get(
                            channel,
                        ) as ChannelGuildText
                    ).createMessage({
                        content: `${current_layer}/${total_layer}`,
                        files: [
                            {
                                value: Buffer.from(
                                    await currentImg.arrayBuffer(),
                                ),
                                filename: 'img.png',
                                contentType: 'image/png',
                            },
                        ],
                    });
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
