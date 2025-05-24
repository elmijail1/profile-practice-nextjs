import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.nextUrl)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 5)
    const order = searchParams.get("oder") || "name"
    const skip = (page - 1) * limit

    try {
        const [users, total] = await Promise.all([ // do multiple queries at once???
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { [order]: "asc" }
            }),
            prisma.user.count()
        ])

        return NextResponse.json({ users, total })
    } catch (error) {
        console.error(`Error fetching users: ${error}`)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// INITIAL ARRANGEMENT WITHOUT PAGINATION
// export async function GET(request: NextRequest) {
//     try {
//         const users = await prisma.user.findMany({
//             select: {
//                 id: true,
//                 name: true,
//                 joinedIn: true,
//                 emoji: true,
//                 bgColor: true
//             }
//         })

//         return NextResponse.json(users)
//     } catch (error) {
//         console.error(`Error fetching users: ${error}`)
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//     }
// }