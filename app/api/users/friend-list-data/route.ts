import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 1. extract an array of IDs from the request's body and see if it's an array
        const { ids } = await req.json()
        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 })
        }

        // 2. fetch data for users with the extracted IDs
        const users = await prisma.user.findMany({
            where: { id: { in: ids } },
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
        if (users.length !== ids.length) {
            const foundIds = users.map(user => user.id)
            const missingIds = ids.filter(id => !foundIds.includes(id))
            console.error("Missing IDs in DB: ", missingIds)
            return NextResponse.json(
                { error: "One or more friend IDs are invalid or missing from the database" },
                { status: 500 }
            )
        }
        return NextResponse.json(users)

    } catch (error) {
        console.error({ error: "Fetching friend list failed" }, { status: 500 })
    }
}