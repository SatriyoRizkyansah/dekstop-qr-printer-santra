export interface Printer {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'error';
}

export interface QRCodeData {
    text: string;
    size: number;
    margin: number;
}