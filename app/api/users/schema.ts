import { z } from "zod"

const userSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().max(20),
    username: z.string().max(20),
    emoji: z.string().length(1),
    bgColor: z.array(z.number()).length(3),
    joinedIn: z.date(),
    aboutMe: z.string().max(100),
    friends: z.array(z.number())
})

export default userSchema