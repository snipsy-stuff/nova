export interface GuildSetings {
    guildId: string;
    star_board?: StarboardSettings;
    mod_log?: ModLogSettings;
    welcome?: WelcomeSettings;
    tupper?: TupperBotSettings;
}

interface StarboardSettings {
    enabled: boolean;
    channel: string;
    messages: string[];
    react_emoji: string;
    emojis: { count: number; id: string }[];
}

interface ModLogSettings {
    enabled: boolean;
    channel: string;
    channels: boolean; // TODO: NO CHANNEL POSITION UPDATES
    emojis: boolean;
    invites: boolean;
    members: boolean; // join-leave / roles
    messages: boolean;
    mod_actions: boolean;
    reactions: boolean;
    roles: boolean; // TODO: NOT DO ROLE POSITION UPDATES
    stickers: boolean;
}

interface WelcomeSettings {
    enabled: boolean;
    channel: string;
    bans: boolean;
    account_age: WelcomeAccountAgeSettings;
}

interface WelcomeAccountAgeSettings {
    enabled: boolean;
    min_age: number;
    action: 'kick' | 'mute' | 'ban';
}

interface TupperBotSettings {
    enabled: boolean;
}
