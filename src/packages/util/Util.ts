export function generateRandomBase64(length = 32) {
    const randomBuffer = Buffer.alloc(length);
    for (let i = 0; i < length; i++) {
        randomBuffer[i] = Math.floor(Math.random() * 256);
    }
    return randomBuffer.toString('base64');
}
