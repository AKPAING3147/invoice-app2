import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("User already exists");
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        console.log("Hashing password...");
        const hashedPassword = await hashPassword(password);
        console.log("Password hashed.");

        console.log("Creating user...");
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        console.log("User created:", user.id);

        return NextResponse.json({ message: "User created", user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
    }
}
