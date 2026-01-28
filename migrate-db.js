const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    try {
        // Check if columns exist by trying to query them
        const session = await prisma.activeSession.findFirst();
        console.log('✅ Database schema is up to date!');
        console.log('Sample session:', session);
    } catch (error) {
        console.error('❌ Schema needs update:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
