import { prisma } from "@/lib/prisma"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, request) {
                if (!credentials?.email || !credentials?.password) {
                    console.error("Missing email or password in credentials.")
                    throw new Error("Missing credentials.")
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })
                if (!user) {
                    console.warn("No user found with that email.")
                    throw new Error("Invalid email or password.")
                }
                const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!)
                if (!passwordsMatch) {
                    console.warn("Invalid password attempt.")
                    throw new Error("Invalid email of password.")
                }

                const { hashedPassword, ...safeUser } = user

                return {
                    ...safeUser,
                    id: user.id.toString()
                }
            }
        })
    ]
})

export { handler as GET, handler as POST }