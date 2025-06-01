import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { PrismaAdapter } from "@auth/prisma-adapter"

// CHANGE BACK TO 10 * 60
const INACTIVITY_LIMIT = 30 * 60 // in seconds

export const authOptions: NextAuthOptions = {
    // custom generated PrismaClient is compatible (should be at least)
    adapter: PrismaAdapter(prisma as any),
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

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

            // 1. Figuring out the current time
            const now = Math.floor(Date.now() / 1000)

            // 2. Setting custom data to the token on the initial sign-in
            if (user) {
                // we take the ID from the user and save it to the token to avoid fetching it from the server every time we need it (NOT related to inactivity)
                token.id = user.id
                // we save the time of the token being last used which is now upong logging in
                token.lastActive = now

                // we also make sure to fetch the right name and email of the user with the specified ID
                // for that we first attempt to find the user with that ID:
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: Number(token.id) },
                        select: { name: true, email: true }
                    })
                    // then, if successful, we save the user's data to the token:
                    if (dbUser) {
                        token.name = dbUser.name
                        token.email = dbUser.email
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error)
                }

                return token
            }

            // 3. Inactivity logic
            // 3.1. When was the user last active?
            const lastActive = token.lastActive ?? now

            // 3.2. Did the user go beyond the inactivity limit?
            const inactiveDuration = now - lastActive

            // 3.3. If they did, strip them of their token!
            if (inactiveDuration > INACTIVITY_LIMIT) {
                // force token expiration by returning an empty object
                return {}
            }

            // 3.4. If they didn't, extend the allowed inactivity period
            token.lastActive = now

            // 4. Current name & email fetch
            // to avoid stale data after updating either in the profile edit
            if (token.id) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: Number(token.id) },
                        select: { name: true, email: true }
                    })
                    if (dbUser) {
                        token.name = dbUser.name
                        token.email = dbUser.email
                    }
                } catch (error) {
                    console.error("Error refreshign user data: ", error)
                }
            }

            return token
        },
        async session({ session, token }) {
            // if the token is invalid, return a dummy session
            // cause TS freaks out when you try returning null
            if (!token?.lastActive || !token?.id) {
                return {
                    user: { name: "", email: "", id: "" },
                    expires: ""
                }
            }

            // saving data from the token to the session
            // ID is custom, the other two are default
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
        maxAge: INACTIVITY_LIMIT, // in seconds, hence it's 24 hours
        updateAge: 0 // don't refresh session automatically on useSession(), since we manually do it on each render
    },
    jwt: {
        maxAge: INACTIVITY_LIMIT, // also in seconds
    },
    pages: {
        signIn: "/login"
    }
}