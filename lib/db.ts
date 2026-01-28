import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

try {
    // Check if we can instantiate it (this might fail if not generated)
    // We use the imported class. If import failed, we wouldn't be here, 
    // but if the internal require fails, it might crash. 
    // Actually, import static is hoisted. 
    // We need to use require for safety if we suspect the module itself is broken.

    if (globalForPrisma.prisma) {
        prismaInstance = globalForPrisma.prisma;
    } else {
        prismaInstance = new PrismaClient({
            log: ["query"],
        });
    }
} catch (e) {
    console.error("Failed to initialize Prisma Client. Database features disabled.", e);
    // Mock Prisma to prevent crash on property access
    const mockHandler = {
        get: (target: any, prop: string) => {
            return new Proxy({}, {
                get: () => async () => {
                    console.warn(`Database operation '${prop}' skipped: Client not initialized.`);
                    return null;
                }
            });
        }
    };
    prismaInstance = new Proxy({}, mockHandler) as unknown as PrismaClient;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;

export const prisma = prismaInstance;
