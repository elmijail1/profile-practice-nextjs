import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import userSchema from "./schema";

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json(users)
    } catch (error) {
        console.error(`Error fetching users: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}