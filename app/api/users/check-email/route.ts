import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
    // extracting email & id from...
    const { email, userId } = await req.json()

    // validate if the user's session is active
    if (userId) {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 })
        }
    }


    // validating that there's email in the request
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // checking if a user with this email exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    // the user with this email exists and it's not the current user
    // if the check takes place on sign up, then no need to check what user has the same email
    if (userId) {
        const isTaken = !!existingUser && existingUser.id.toString() !== userId
        return NextResponse.json({ isTaken })
    } else {
        const isTaken = !!existingUser
        return NextResponse.json({ isTaken })
    }
}