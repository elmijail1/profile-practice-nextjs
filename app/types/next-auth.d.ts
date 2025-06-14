// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        lastActive?: number;
        id?: string;
        name?: string;
        email?: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string
    }
}