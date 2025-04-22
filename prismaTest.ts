import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://mikhail:21340@localhost:5432/profile_practice?schema=public"
        }
    }
})

async function main() {
    const users = await prisma.user.findMany()
    console.log('All users:', users)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })