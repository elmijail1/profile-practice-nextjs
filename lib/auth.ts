import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
    // custom generated PrismaClient is compatible (should be at least)
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials) {
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
                    throw new Error("Invalid email or password.")
                }

                const { hashedPassword: _hashed, ...safeUser } = user

                return {
                    ...safeUser,
                    id: user.id.toString()
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }

            const dbUser = await prisma.user.findUnique({
                where: { id: Number(token.id) },
                select: { name: true, email: true }
            })

            if (dbUser) {
                token.name = dbUser.name
                token.email = dbUser.email
            }

            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string
            }
            if (token?.name) {
                session.user.name = token.name as string
            }
            if (token?.email) {
                session.user.email = token.email as string
            }
            return session
        }
    },
    session: {
        strategy: "jwt" as const, // to show to TS that it's not just a string but an expected value of the strategy property
    },
    pages: {
        signIn: "/login"
    }
}