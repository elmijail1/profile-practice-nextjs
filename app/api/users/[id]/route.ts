import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/app/types/user";

export async function GET({ params }: { params: Promise<User> }) {
    try {
        const { id } = await params
        const user = await prisma.user.findUnique({ where: { id: Number(id) } })
        return NextResponse.json(user)
    } catch (error) {
        console.error(`Error fetching the user: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}