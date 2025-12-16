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
        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await request.json();
        const category = await prisma.category.create({
            data: {
                name: body.name,
                userId
            }
        });
        return NextResponse.json(category);
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}

// Handle DELETE via a separate route or check if we want to handle it here with searchParams or ID
// Typically safe to just use ID in a dynamic route app/api/categories/[id]/route.ts
// But for simplicity in this turn, I'll stick to basic CRUD here and maybe delete by ID if passed in body or params?
// Standard REST says DELETE /api/categories/[id].
// I'll create that separate file if needed or just handle it here if body has ID (less restful) or just create the ID route.
// Let's create the ID route as well for deletion, it's cleaner.
