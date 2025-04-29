import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcrypt"

// what the request's body must contain
const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5)
})

export async function POST(request: NextRequest) {
    try {
        // 1. validate the request body
        const body = await request.json()
        const validation = schema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input.", details: validation.error.errors },
                { status: 400 }
            )
        }
        const { email, password } = validation.data

        // 2. check whether the user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })
        if (existingUser) {
            return NextResponse.json(
                { error: "A user with this email already exists." },
                { status: 409 }
            )
        }

        // 3. hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. create the user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                hashedPassword: hashedPassword
            }
        })

        // 5. return a success response
        return NextResponse.json(
            { email: newUser.email },
            { status: 201 }
        )

    } catch (error) {
        console.error("Registration error: ", error)
        return NextResponse.json(
            { error: "Error signing up a user." },
            { status: 500 }
        )
    }
}