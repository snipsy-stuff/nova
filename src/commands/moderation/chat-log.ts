import { RootCommand } from 'packages/commands/RootCommand';
import { ChatlogCreateCommand } from './chatlog/chatlog.create';
@RootCommand.requirePermission(['MANAGE_CHANNELS', 'MANAGE_MESSAGES'])
@RootCommand.applyOptions({
    name: 'chatlog',
    description:
        'creates a chatlog to collect all role-play informations.',
    options: [new ChatlogCreateCommand()],
})
export default class ChatlogCommnad extends RootCommand {}
