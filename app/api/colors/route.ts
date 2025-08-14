export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();

    try {
        const colors = await prisma.productColor.findMany({ orderBy: { id: 'asc' }, });
        return NextResponse.json(colors);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const { name, hex } = await request.json();
        if (!name) return NextResponse.json({ error: 'Color name is required' }, { status: 400 });

        const color = await prisma.productColor.create({ data: { name, hex: hex ?? null } });

        return NextResponse.json(color, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}