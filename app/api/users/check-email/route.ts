import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {

    // extracting email & id from the request's search params (??)
    const email = req.nextUrl.searchParams.get("email")
    const userId = req.nextUrl.searchParams.get("userId")

    // validating that there's email in the request
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // checking if a user with this email exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    // the user with this email exists and it's not the current user
    const isTaken = !!existingUser && existingUser.id.toString() !== userId

    // send a response that the email is already in use
    return NextResponse.json({ isTaken })
}