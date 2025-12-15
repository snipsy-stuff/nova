import { GuildSetings } from '@nova/typings/db/guilds';

export const SUPPORT_SERVER = '';

export const CHANNELS = {
    BOOT_LOG: '',
    COMMAND_LOG: '',
    ERROR_LOG: '',
    JOIN_LOG: '',
};

export const owners: string[] = [
    '1395801348490137751',
    '735199620803854428',
];

export const defaultSettings: Required<GuildSetings> = {
    guildId: '',
    mod_log: {
        enabled: false,
        channel: '',
        channels: true,
        emojis: true,
        invites: true,
        members: true,
        messages: true,
        mod_actions: true,
        roles: true,
        stickers: true,
        reactions: true,
    },
    star_board: {
        enabled: false,
        channel: '',
        emojis: [],
        messages: [],
        react_emoji: '',
    },
    welcome: {
        enabled: false,
        channel: '',
        bans: false,
        account_age: {
            enabled: false,
            min_age: 0,
            action: 'none'
        }
    },
    tupper: {
        enabled: false
    }
};

export const contentTypes = {
    images: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp',
    ],
};
