import { prisma } from "@/lib/prisma"

export default async function GuysPage() {
    const users = await prisma.user.findMany()
    console.log(users)
    return (
        <main>
            <h1 className="text-zinc-950">Guys</h1>
            <ul>
                {users.map((user) => {
                    return (
                        <li key={user.id}>
                            {user.name}
                        </li>
                    )
                })}
            </ul>
        </main>
    )
}