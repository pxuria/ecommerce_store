export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma, { connectDB } from '@/lib/db';
import { ParamsType } from '@/types';

export async function GET(_req: Request, { params }: ParamsType) {
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

export async function PUT(req: Request, { params }: ParamsType) {
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

export async function DELETE(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        await prisma.productCountry.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Country deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
}