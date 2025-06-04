import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 1. retrieve the session ID (current user)
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 })
        }

        const userId = Number(session.user.id)

        // 2. retrieve the current page profile's ID (the user you want to add / remove to your friend list)
        const { targetId } = await req.json()
        if (!targetId) {
            return NextResponse.json({ error: "Request missing target ID" }, { status: 400 })
        }

        // 3. retrieve the current user's DB data (friend list)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { friends: true }
        })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // 4. update the list accordingly: either remove or add the target user's ID
        const updatedList = user.friends.includes(targetId)
            ? user.friends.filter(id => id !== targetId)
            : [...user.friends, targetId]

        // 5. send an update call to the DB
        await prisma.user.update({
            where: { id: userId },
            data: { friends: updatedList }
        })
        return NextResponse.json({ success: true })

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}