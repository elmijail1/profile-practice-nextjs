import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {

    // extracting email & id from...

    // ...query params (the GET approach)
    // const email = req.nextUrl.searchParams.get("email")
    // const userId = req.nextUrl.searchParams.get("userId")

    // ...request's body (the POST approach)
    const { email, userId } = await req.json()

    // validating that there's email in the request
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // checking if a user with this email exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    // the user with this email exists and it's not the current user
    if (userId) {
        var isTaken = !!existingUser && existingUser.id.toString() !== userId
    } else {
        var isTaken = !!existingUser
    }

    // send a response that the email is already in use
    return NextResponse.json({ isTaken })
}