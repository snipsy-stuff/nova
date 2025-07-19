interface ConsoleStyle {
    hexColor?: string;
    bgColor?: string;
    bold?: boolean;
    underline?: boolean;
    strikeThrough?: boolean;
}
export class Logger {
    types = {
        LOG: 'log',
        ERROR: 'error',
        DEBUG: 'debug',
    };

    constructor(public name = 'logger') {}

    log(content: string) {
        return this.$write(content, 'LOG');
    }

    error(error: Error, issuer: string) {
        return this.$write(
            `<${issuer}>${error.name} ${error.message}`,
            'ERROR',
        );
    }

    debug(content: string, issuer: string) {
        return this.$write(
            `<${styleText(issuer, { hexColor: Colors.DEBUG_INFO })}> ${styleText(content, { hexColor: '#cdccff' })}`,
            'DEBUG',
        );
    }

    private $write(content: string, type: keyof Logger['types']) {
        return console[type === 'ERROR' ? 'error' : 'log'](
            `[${this.name}] [${styleText(type, {
                hexColor: Colors[type],
                bold: true,
                underline: true,
                strikeThrough: false,
            })}] ${styleText(content, { hexColor: '#cdccff' })}`,
        );
    }
}

const Colors = {
    ERROR: '#FFFFFF',
    LOG: '#17EFCF',
    DEBUG: '#9EF738',
    DEBUG_INFO: '#4E55E0',
} as const;

function styleText(text: string, style: ConsoleStyle): string {
    const codes: string[] = [];

    // Bold
    if (style.bold) codes.push('1');

    // Underline
    if (style.underline) codes.push('4');

    // Strike-through
    if (style.strikeThrough) codes.push('9');

    // Foreground color (if hex provided)
    if (style.hexColor) {
        const hex = style.hexColor.replace(/^#/, '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        codes.push(`38;2;${r};${g};${b}`);
    }

    // Background color (if hex provided)
    if (style.bgColor) {
        const hex = style.bgColor.replace(/^#/, '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        codes.push(`48;2;${r};${g};${b}`);
    }

    return `\x1b[${codes.join(';')}m${text}\x1b[0m`;
}
