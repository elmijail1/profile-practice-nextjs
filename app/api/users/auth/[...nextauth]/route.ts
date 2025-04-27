import NextAuth from "next-auth"
import { CredentialsProvider } from "next-auth/providers/credentials"

const handler = NextAuth({
    providers: [
        // carry on here
    ]
})

export { handler as GET, handler as POST }