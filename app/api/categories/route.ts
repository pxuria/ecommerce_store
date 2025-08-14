export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();

    try {
        const categories = await prisma.productCategory.findMany({ orderBy: { id: 'asc' }, });
        return NextResponse.json(categories);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const { name, slug } = await request.json();
        if (!name || !slug) return NextResponse.json({ error: 'category name or slug is required' }, { status: 400 });

        const category = await prisma.productCategory.create({ data: { name, slug } });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}