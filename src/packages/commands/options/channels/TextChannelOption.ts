import { ChannelTypes } from 'detritus-client/lib/constants';
import { ChannelOption } from './BaseChannel';

export class TextChannelOption extends ChannelOption {
    constructor() {
        super({
            channelTypes: [
                ChannelTypes.GUILD_TEXT,
                ChannelTypes.GUILD_NEWS_THREAD,
                ChannelTypes.GUILD_PUBLIC_THREAD,
                ChannelTypes.GUILD_PRIVATE_THREAD,
            ],
        });
    }
}
