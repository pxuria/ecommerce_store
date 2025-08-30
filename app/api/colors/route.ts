export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 20);

        const skip = (page - 1) * limit;

        const colors = await prisma.productColor.findMany({
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        });

        const total = await prisma.productColor.count();

        return NextResponse.json({
            data: colors,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }, { status: 200 });
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