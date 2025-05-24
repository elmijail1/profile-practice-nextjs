import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 1. extract the request's body
        const body = await req.json()
        if (!body) {
            return NextResponse.json({ error: "No body in the request" }, { status: 400 })
        }

        // 2. extract data from the body
        const { friends, page, limit } = body
        if (!Array.isArray(friends)) {
            return NextResponse.json({ error: "Invalid friends values" }, { status: 400 })
        }
        if (typeof page !== "number" || typeof limit !== "number") {
            return NextResponse.json({ error: "Invalid page or limit values" }, { status: 400 })
        }

        // 3. if page & limit are OK, use them to calculate a skip
        const skip = (page - 1) * limit


        // 4. fetch data for users with the extracted friends
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: { id: { in: friends } },
                select: {
                    id: true,
                    name: true,
                    emoji: true,
                    bgColor: true
                },
                skip,
                take: limit,
                orderBy: { name: "asc" }
            }),
            prisma.user.count({
                where: { id: { in: friends } }
            })
        ])
        if (!users) {
            return NextResponse.json({ error: "Users not found" }, { status: 404 })
        }

        // 5. de-bug if the number of fetched users isn't equal to the length of the friends array
        // note that this can only work with pagination when limit === friends.length
        if (limit >= friends.length && users.length !== friends.length) {
            const foundfriends = users.map(user => user.id)
            const missingfriends = friends.filter(id => !foundfriends.includes(id))
            console.error("Missing friends in DB: ", missingfriends)
            return NextResponse.json(
                { error: "One or more friend friends are invalid or missing from the database" },
                { status: 500 }
            )
        }
        return NextResponse.json({ users, total })

    } catch (error) {
        console.error({ error: "Fetching friend list failed" }, { status: 500 })
        return NextResponse.json({ error: "Server error while fetching friend list" }, { status: 500 })
    }
}

// USERS FETCHER WITHOUT PAGINATION
// const users = await prisma.user.findMany({
//     where: { id: { in: friends } },
//     select: {
//         id: true,
//         name: true,
//         emoji: true,
//         bgColor: true
//     }
// })