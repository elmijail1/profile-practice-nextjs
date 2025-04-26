import { z } from "zod"

const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().max(20),
    username: z.string().max(20),
    emoji: z.string().min(1).max(2),
    bgColor: z.array(z.number()).length(3),
    joinedIn: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg)
    }, z.date()),
    aboutMe: z.string().max(100),
    friends: z.array(z.number())
})

export default userSchema