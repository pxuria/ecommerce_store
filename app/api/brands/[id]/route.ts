export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma, { connectDB } from '@/lib/db';
import { ParamsType } from '@/types';

export async function GET(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        const brand = await prisma.productBrand.findUnique({ where: { id: parseInt(params.id) } });
        if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        return NextResponse.json(brand);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        const data = await req.json();
        const brand = await prisma.productBrand.update({ where: { id: parseInt(params.id) }, data });
        return NextResponse.json(brand);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        await prisma.productBrand.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Brand deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}