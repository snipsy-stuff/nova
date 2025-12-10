export function generateRandomBase64(length = 32) {
    const randomBuffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        randomBuffer[i] = Math.floor(Math.random() * 256);
    }
    return randomBuffer.toString('base64');
}
type CommonColor =
    | 'red'
    | 'green'
    | 'blue'
    | 'lightblue'
    | 'cyan'
    | 'yellow'
    | 'magenta'
    | 'white'
    | 'black'
    | 'gray';

// Union with string to allow arbitrary hex codes
type ColorInput = CommonColor | string;

/**
 * Wrap text with ANSI escape codes based on a hex color or common color name.
 */
export function colorizeText(
    color: CommonColor,
    text: string,
    background?: boolean,
): string;
export function colorizeText(
    color: ColorInput,
    text: string,
    background = false,
): string {
    const colorNameMap: Record<CommonColor, string> = {
        red: '#FF0000',
        green: '#00FF00',
        blue: '#0000FF',
        lightblue: '#ADD8E6',
        cyan: '#00FFFF',
        yellow: '#FFFF00',
        magenta: '#FF00FF',
        white: '#FFFFFF',
        black: '#000000',
        gray: '#808080',
    };

    // Resolve named colors to hex if available
    const hex =
        (colorNameMap as Record<string, string>)[color] ?? color;
    const cleanHex = hex.replace(/^#/, '');

    if (cleanHex.length !== 6) {
        throw new Error(
            `Invalid color: ${color}. Must be #RRGGBB or a known name.`,
        );
    }

    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    const prefix = background ? 48 : 38;
    const ansiCode = `\x1b[${prefix};2;${r};${g};${b}m`;

    return `${ansiCode}${text}\x1b[0m`;
}
