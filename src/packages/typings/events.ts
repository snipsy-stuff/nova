export interface EventOptions {
    event: string;
    emitter: string;
    enabled?: boolean;
    id: string;
    type: 'on' | 'once';
}
