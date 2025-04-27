import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                joinedIn: true,
                emoji: true,
                bgColor: true
            }
        }
        )
        return NextResponse.json(users)
    } catch (error) {
        console.error(`Error fetching users: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}