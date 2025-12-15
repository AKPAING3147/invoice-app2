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

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const [productCount, customerCount, voucherCount, user] = await Promise.all([
            prisma.product.count({ where: { userId } }),
            prisma.customer.count({ where: { userId } }),
            prisma.voucher.count({ where: { userId } }),
            prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
        ]);

        return NextResponse.json({
            productCount,
            customerCount,
            voucherCount,
            userName: user?.name || "User"
        });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
