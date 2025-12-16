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
        const [productCount, customerCount, voucherCount, user, revenueAgg, recentSales] = await Promise.all([
            prisma.product.count({ where: { userId } }),
            prisma.customer.count({ where: { userId } }),
            prisma.voucher.count({ where: { userId } }),
            prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
            prisma.voucher.aggregate({ where: { userId }, _sum: { total: true } }),
            prisma.voucher.findMany({
                where: {
                    userId,
                    date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } // Last 7 days
                },
                select: { date: true, total: true }
            })
        ]);

        // Process sales for chart
        const salesMap = new Map<string, number>();
        recentSales.forEach(s => {
            const dateStr = new Date(s.date).toISOString().split('T')[0];
            salesMap.set(dateStr, (salesMap.get(dateStr) || 0) + s.total);
        });

        const salesTrend = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i)); // Past 6 days + Today
            const dateStr = d.toISOString().split('T')[0];
            return {
                name: dateStr, // Client can format this
                total: salesMap.get(dateStr) || 0
            };
        });

        return NextResponse.json({
            productCount,
            customerCount,
            voucherCount,
            userName: user?.name || "User",
            revenue: revenueAgg._sum.total || 0,
            salesTrend
        });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
