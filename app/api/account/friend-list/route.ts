import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1. extract the user's ID from the session
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(null, { status: 204 })
        }

        // 2. extract the user's friends array from the server with the ID
        const user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
            select: { friends: true }
        })
        if (!user) {
            return NextResponse.json(
                { error: "Authenticated user not found in database" },
                { status: 500 }
            )
        }

        // 3. return the friends value from the user's DB entry
        return NextResponse.json(user.friends)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}