import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    try {
        const token = await getToken({ req })

        if (token) {
            return NextResponse.redirect(new URL(`/profile/${token?.id}`, req.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error("Error in authentication middleware")
        return NextResponse.next()
    }
}

export const config = {
    matcher: ["/login"]
}