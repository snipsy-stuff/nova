export interface GuildSetings {
    guildId: string;
    starboard: Starboard;
}

interface Starboard {
    enabled: boolean;
    channel: string;
    messages: string[];
    emojis: { count: number; id: string }[];
}
