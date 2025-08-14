export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
    await connectDB();

    try {
        const brand = await prisma.ProductBrand.findUnique({ where: { id: parseInt(params.id) } });
        if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

        return NextResponse.json(brand);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: Params) {
    await connectDB();

    try {
        const data = await req.json();
        const brand = await prisma.ProductBrand.update({ where: { id: parseInt(params.id) }, data });
        return NextResponse.json(brand);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    await connectDB();

    try {
        await prisma.ProductBrand.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Brand deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
}