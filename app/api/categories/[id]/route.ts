import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export const dynamic = 'force-dynamic';

async function getUserId(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1];
    const payload = await verifyJWT(token);
    return payload?.userId as number | undefined;
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        // Optional: Check if products exist in this category and nullify or block
        // For now, let's just nullify their categoryId
        await prisma.product.updateMany({
            where: { categoryId: Number(id), userId },
            data: { categoryId: null }
        });

        await prisma.category.delete({
            where: { id: Number(id), userId }
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
