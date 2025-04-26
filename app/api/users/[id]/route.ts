import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import userSchema from "../schema";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const user = await prisma.user.findUnique({ where: { id: Number(id) } })
        return NextResponse.json(user)
    } catch (error) {
        console.error(`Error fetching the user: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const body = await request.json()

        const validation = userSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: validation.data
        })
        return NextResponse.json({ user: updatedUser }, { status: 200 })
    } catch (error) {
        console.error(`Error updating the user: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}