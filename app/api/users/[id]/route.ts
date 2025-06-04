import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partialUserSchema } from "../schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                aboutMe: true,
                joinedIn: true,
                emoji: true,
                bgColor: true,
                friends: true,
                email: true
            }
        })
        return NextResponse.json(user)
    } catch (error) {
        console.error(`Error fetching the user: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // validate if the user's session is active
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()


        // validation the input
        const validation = partialUserSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors }, { status: 400 })
        }

        // finding the user entry to update in the DB
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // updating the user entry in the DB
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