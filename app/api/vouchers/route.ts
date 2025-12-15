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
        const vouchers = await prisma.voucher.findMany({
            where: { userId },
            orderBy: { id: "desc" },
            include: { customer: true }
        });
        // Parse items JSON for the client
        const parsedVouchers = vouchers.map(v => ({
            ...v,
            items: JSON.parse(v.items)
        }));
        return NextResponse.json(parsedVouchers);
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const { voucher_no, customerId, total, items, status, paidAmount, receiveDate, date } = body;

        if (!voucher_no || !customerId || !items) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const voucher = await prisma.voucher.create({
            data: {
                voucher_no,
                customerId: Number(customerId),
                total: Number(total),
                items: JSON.stringify(items),
                status: status || "UNPAID",
                paidAmount: Number(paidAmount) || 0,
                receiveDate: receiveDate ? new Date(receiveDate) : null,
                date: date ? new Date(date) : new Date(),
                userId
            }
        });
        return NextResponse.json(voucher, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}
