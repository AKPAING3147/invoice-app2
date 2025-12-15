import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, new_password, confirm_password } = body;

        if (!email || !new_password || !confirm_password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        if (new_password !== confirm_password) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return success even if user not found for security? 
            // Or just fail for this simulated "Forgot Password". Since it's local app, fail is better UX.
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const hashedPassword = await hashPassword(new_password);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password reset successfully. Please login." });
    } catch (e: any) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
