export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import prisma, { connectDB } from '@/lib/db';
import { ParamsType } from '@/types';

export async function GET(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        const category = await prisma.productCategory.findUnique({ where: { id: parseInt(params.id) } });
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        return NextResponse.json(category);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        const data = await req.json();
        const category = await prisma.productCategory.update({ where: { id: parseInt(params.id) }, data });
        return NextResponse.json(category);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
}

export async function DELETE(_req: Request, { params }: ParamsType) {
    await connectDB();

    try {
        await prisma.productCategory.delete({ where: { id: parseInt(params.id) } });
        return NextResponse.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
}