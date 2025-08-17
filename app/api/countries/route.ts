export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();

    try {
        const countries = await prisma.productCountry.findMany({ orderBy: { id: 'asc' }, });
        return NextResponse.json(countries);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const { name, slug } = await request.json();
        if (!name || !slug) return NextResponse.json({ error: 'country name or slug is required' }, { status: 400 });

        const country = await prisma.productCountry.create({ data: { name, slug } });
        return NextResponse.json(country, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}