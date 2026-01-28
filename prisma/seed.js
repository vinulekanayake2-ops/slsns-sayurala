const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { officialId: 'ADMIN' },
        update: {},
        create: {
            officialId: 'ADMIN',
            name: 'System Administrator',
        },
    })

    // Create Sample Module
    const navigationModule = await prisma.module.upsert({
        where: { slug: 'navigation' },
        update: {},
        create: {
            name: 'Navigation & Seamanship',
            slug: 'navigation',
            questions: {
                create: [
                    {
                        text: 'What is the color of the starboard navigation light?',
                        options: JSON.stringify(['Red', 'Green', 'White', 'Yellow']),
                        correctIndex: 1,
                    },
                    {
                        text: 'Which side of the ship is Port?',
                        options: JSON.stringify(['Left', 'Right', 'Front', 'Back']),
                        correctIndex: 0,
                    },
                    {
                        text: 'What does one short blast of the whistle mean?',
                        options: JSON.stringify(['I am altering my course to starboard', 'I am altering my course to port', 'I am operating astern propulsion', 'I do not understand your intentions']),
                        correctIndex: 0,
                    }
                ]
            }
        },
    })

    console.log({ admin, navigationModule })
    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
