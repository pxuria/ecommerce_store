export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    await connectDB();

    try {
        const country = await prisma.productCountry.findUnique({ where: { id: parseInt(params.id) } });
        if (!country) return NextResponse.json({ error: 'Country not found' }, { status: 404 });
        return NextResponse.json(country);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    await connectDB();

    try {
        const data = await req.json();
        const country = await prisma.productCountry.update({ where: { id: parseInt(params.id) }, data });
        return NextResponse.json(country);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    await connectDB();

    try {
        await prisma.productCountry.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Country deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
}