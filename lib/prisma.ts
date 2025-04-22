// Singleton Prisma Client setup
import { PrismaClient } from '@/generated/prisma/client'

// extend the globalThis object to store the client
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// reuse existing client if it exists
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'],
    })

// only assign it globally in dev to avoid memory leak
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}