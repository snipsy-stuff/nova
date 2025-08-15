import { Permissions } from 'detritus-client/lib/constants';
import { RootCommand } from 'packages/commands/RootCommand';
import { ChatlogCreateCommand } from './chatlog/chatlog.create';
@RootCommand.applyOptions({
    name: 'chatlog',
    description:
        'creates a chatlog to collect all role-play informations.',
    permissions: [Permissions.MANAGE_MESSAGES],
    options: [new ChatlogCreateCommand()],
})
export default class ChatlogCommnad extends RootCommand {}
