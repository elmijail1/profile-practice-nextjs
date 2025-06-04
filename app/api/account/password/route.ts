import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    try {
        // 1. retrieve the session's ID
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Session expired" }, { status: 401 })
        }

        // 2. make sure that the body contains both the current & new password
        // we need that to compare them
        const { currentPassword, newPassword } = await req.json()
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Both current and new passwords are required" },
                { status: 400 }
            )
        }

        // 2.5. also make sure that both passwords are valid
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/ // 1+ lowercase alphabet ch; 1+ uppercase alphabet ch; 1+ digit; 1+ special character; total length = 8-15
        // this regex must be the same as in profile/PasswordWindow

        if (!regex.test(currentPassword) || !regex.test(newPassword)) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 })
        }

        // 3. retrieve the user's hashed password for comparison
        const user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
            select: { hashedPassword: true }
        })
        if (!user || !user.hashedPassword) {
            return NextResponse.json(
                { success: false, message: "User not found or password missing" },
                { status: 404 }
            )
        }

        // 4. check if the current password from the input is the same as the hashed one on the server
        const currentIsValid = await bcrypt.compare(currentPassword, user.hashedPassword)
        if (!currentIsValid) {
            return NextResponse.json(
                { success: false, message: "Current password is incorrect" },
                { status: 401 }
            )
        }

        // 5. check if the new password from the input is different from the hashed one on the server
        // you still should compare passwords at the client, but, since client's checks can be bypassed, it's better to have another check here
        const sameAsOld = await bcrypt.compare(newPassword, user.hashedPassword)
        if (sameAsOld) {
            return NextResponse.json(
                { success: false, message: "New password must be different from the current one" },
                { status: 400 }
            )
        }

        // 6. hash the new password and update the user with it
        const hashedNew = await bcrypt.hash(newPassword, 12)
        await prisma.user.update({
            where: { id: Number(session.user.id) },
            data: { hashedPassword: hashedNew }
        })

        return NextResponse.json(
            { success: true, message: "Password updated successfully" },
            { status: 200 }
        )


    } catch (error) {
        console.error("Password update error: ", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}