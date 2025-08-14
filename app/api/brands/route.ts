export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();

    try {
        const brands = await prisma.ProductBrand.findMany({ orderBy: { id: 'asc' }, });
        return NextResponse.json(brands);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const { name, slug } = await request.json();
        if (!name) return NextResponse.json({ error: 'brand name is required' }, { status: 400 });

        const brand = await prisma.ProductBrand.create({ data: { name, slug: slug ?? null } });
        return NextResponse.json(brand, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}