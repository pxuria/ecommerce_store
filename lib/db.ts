import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var __prisma__: PrismaClient | undefined;
}

/**
 * Create a single PrismaClient across the app (dev + prod).
 * In dev, Next.js hot reloads can create many clients if we don't reuse a global.
 */
const prisma =
    global.__prisma__ ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
    });

// Reuse the client in dev
if (process.env.NODE_ENV !== 'production') {
    global.__prisma__ = prisma;
}

/**
 * Call this once where you need a guaranteed connection (route handlers, jobs, etc.).
 * It's safe to call multiple times; Prisma will no-op if already connected.
 */
export async function connectDB() {
    try {
        if (!process.env.DATABASE_URL) throw new Error('❌ DATABASE_URL is not defined in environment variables');
        await prisma.$connect();
        console.log("✅ Prisma connected successfully.")
        return prisma;
    } catch (err) {
        // Centralized logging (you can plug in a logger here)
        console.error('[DB] Connection error:', err);
        throw new Error('Database connection failed');
    }
}

/** Optional: for scripts/tests to gracefully close the pool. */
export async function disconnectDB() {
    try {
        await prisma.$disconnect();
    } catch (err) {
        console.error('[DB] Disconnect error:', err);
    }
}

export default prisma;
