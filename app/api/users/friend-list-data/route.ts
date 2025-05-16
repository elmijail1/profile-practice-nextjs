import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 1. extract an array of friends from the request's body and see if it's an array
        const { friends } = await req.json()
        console.log(friends)
        if (!Array.isArray(friends)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        // 2. fetch data for users with the extracted friends
        const users = await prisma.user.findMany({
            where: { id: { in: friends } },
            select: {
                id: true,
                name: true,
                emoji: true,
                bgColor: true
            }
        })
        if (!users) {
            return NextResponse.json({ error: "Users not found" }, { status: 404 })
        }
        if (users.length !== friends.length) {
            const foundfriends = users.map(user => user.id)
            const missingfriends = friends.filter(id => !foundfriends.includes(id))
            console.error("Missing friends in DB: ", missingfriends)
            return NextResponse.json(
                { error: "One or more friend friends are invalid or missing from the database" },
                { status: 500 }
            )
        }
        return NextResponse.json(users)

    } catch (error) {
        console.error({ error: "Fetching friend list failed" }, { status: 500 })
    }
}