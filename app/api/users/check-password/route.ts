import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ success: false }, { status: 401 })
    }

    const { password } = await req.json()
    if (typeof password !== "string") {
        return NextResponse.json({ success: false, message: "Inavlid credentials" }, { status: 400 })
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/ // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
    // this regex must be the same as in profile/PasswordWindow

    if (!regex.test(password)) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
        select: { hashedPassword: true }
    })

    if (!user || !user.hashedPassword) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 404 })
    }

    const match = await bcrypt.compare(password, user.hashedPassword)
    if (!match) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
}