import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
} 