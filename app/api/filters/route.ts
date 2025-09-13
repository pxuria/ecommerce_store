export const runtime = 'nodejs';

import prisma, { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    console.log(1)
    await connectDB();

    try {
        console.log(2)
        const [brands, categories, countries, colors] = await Promise.all([
            prisma.productBrand.findMany({
                select: { id: true, name: true, slug: true },
                orderBy: { id: "asc" }
            }),
            prisma.productCategory.findMany({
                select: { id: true, name: true, slug: true },
                orderBy: { id: "asc" }
            }),
            prisma.productCountry.findMany({
                select: { id: true, name: true, slug: true },
                orderBy: { id: "asc" }
            }),
            prisma.productColor.findMany({
                select: { id: true, name: true, hex: true },
                orderBy: { id: "asc" }
            })
        ]);
        console.log(3)

        return NextResponse.json({ brands, categories, countries, colors }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}