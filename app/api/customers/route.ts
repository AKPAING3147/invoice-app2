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
        const customers = await prisma.customer.findMany({
            where: { userId },
            orderBy: { id: "desc" },
            include: {
                user: { select: { name: true } },
                vouchers: { select: { total: true, status: true } }
            }
        });

        // Compute total spent manually since SQLite doesn't support aggregate inside findMany nicely or easily without grouping
        const enriched = customers.map(c => {
            const totalSpent = c.vouchers
                .filter(v => v.status === 'PAID') // Only count PAID? Or all? User said "money get", implies realized revenue.
                .reduce((acc, v) => acc + v.total, 0);
            const { vouchers, ...rest } = c;
            return { ...rest, totalSpent };
        });

        return NextResponse.json(enriched);
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { name, email, phone } = body;

        if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

        const customer = await prisma.customer.create({
            data: { name, email, phone, userId }
        });
        return NextResponse.json(customer, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
