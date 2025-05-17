import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    try {
        // 1. Retrieve current user's ID from the session (who wants to delete a friend?)
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }
        const userId = Number(session.user.id)

        // 2. Retrieve the target user's ID from the request (whom do you want to delete?)
        const { friendId } = await req.json()
        if (typeof friendId !== "number") {
            return NextResponse.json({ error: "Invalid friend ID" }, { status: 400 })
        }

        // 3. Retrieve the current user's ID friend list from the server
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { friends: true }
        })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // 4. Filter the current user's friends array
        const updatedFriends = user.friends.filter((id) => id !== friendId)

        // 5. Update the current user's friends array with the filtered one
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                friends: {
                    set: updatedFriends
                },
            },
        })
        if (!updatedUser) {
            return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 })
        }

        return NextResponse.json({ success: true, updatedFriends: updatedUser.friends })
    } catch (error) {
        return NextResponse.json({ error: "Unexpected error during deleting a friend" }, { status: 500 })
    }

}