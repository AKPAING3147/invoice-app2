import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

async function getUserId(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.split(" ")[1];
    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) return null;
    return payload.userId as number;
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const productId = parseInt(id);
        const body = await request.json();
        const { product_name, price, stock, image, categoryId } = body;

        // Check ownership
        const existing = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existing) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        if (existing.userId !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.product.update({
            where: { id: productId },
            data: {
                product_name,
                price: Number(price),
                stock: Number(stock),
                image,
                categoryId: categoryId ? Number(categoryId) : null
            },
            include: { category: true }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const productId = parseInt(id);

        const existing = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existing) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        if (existing.userId !== userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
