export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    await connectDB();

    try {
        const color = await prisma.productColor.findUnique({ where: { id: parseInt(params.id) } });
        if (!color) return NextResponse.json({ error: 'Color not found' }, { status: 404 });
        return NextResponse.json(color);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    await connectDB();

    try {
        const data = await req.json();
        const color = await prisma.productColor.update({ where: { id: parseInt(params.id) }, data });
        return NextResponse.json(color);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    await connectDB();

    try {
        await prisma.productColor.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Color deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
}