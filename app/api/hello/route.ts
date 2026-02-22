import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Hello from QRLamenu API!',
        timestamp: new Date().toISOString()
    });
}
