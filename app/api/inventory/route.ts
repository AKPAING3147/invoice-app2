import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// Helper to get user ID from request
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

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            where: { userId },
            orderBy: { id: 'desc' }
        });
        return NextResponse.json(products); // Return array directly to match frontend expectation
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { product_name, price, stock, image } = body;

        if (!product_name || price === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                product_name,
                price: Number(price),
                stock: Number(stock || 0),
                image: image || null,
                userId
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
