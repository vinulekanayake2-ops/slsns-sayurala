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

    // Seed Marine Engineering
    const marineQuestions = require('./marine_questions.json');

    // First, delete existing questions for this module if any (cleanup for "replace" requirement)
    // We need to fetch the module id first
    const existingMarineModule = await prisma.module.findUnique({ where: { slug: 'marine-engineering' } });
    if (existingMarineModule) {
        await prisma.question.deleteMany({ where: { moduleId: existingMarineModule.id } });
    }

    const marineModule = await prisma.module.upsert({
        where: { slug: 'marine-engineering' },
        update: {
            // If it exists, we just updated the questions by deleting old ones above and adding new ones below? 
            // Actually, we deleted questions but need to re-add. 
            // Upsert update doesn't easily support "replace relation". 
            // So we'll do the create logic below after fetching/creating.
        },
        create: {
            name: 'Marine Engineering',
            slug: 'marine-engineering'
        }
    });

    // Create questions
    for (const q of marineQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                moduleId: marineModule.id
            }
        });
    }

    // Seed Communication
    const communicationQuestions = require('./communication_questions.json');

    // Clean up existing questions for Communication module
    const existingCommModule = await prisma.module.findUnique({ where: { slug: 'communication' } });
    if (existingCommModule) {
        await prisma.question.deleteMany({ where: { moduleId: existingCommModule.id } });
    }

    const communicationModule = await prisma.module.upsert({
        where: { slug: 'communication' },
        update: {},
        create: {
            name: 'Communication',
            slug: 'communication'
        }
    });

    // Create questions for Communication
    for (const q of communicationQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                moduleId: communicationModule.id
            }
        });
    }

    // Seed Logistics
    const logisticsQuestions = require('./logistics_questions.json');

    // Clean up existing questions for Logistics module
    const existingLogisticsModule = await prisma.module.findUnique({ where: { slug: 'logistics' } });
    if (existingLogisticsModule) {
        await prisma.question.deleteMany({ where: { moduleId: existingLogisticsModule.id } });
    }

    const logisticsModule = await prisma.module.upsert({
        where: { slug: 'logistics' },
        update: {},
        create: {
            name: 'Logistics',
            slug: 'logistics'
        }
    });

    // Create questions for Logistics
    for (const q of logisticsQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                moduleId: logisticsModule.id
            }
        });
    }

    // Seed Seamanship
    const seamanshipQuestions = require('./seamanship_questions.json');
    const existingSeamanshipModule = await prisma.module.findUnique({ where: { slug: 'seamanship' } });
    if (existingSeamanshipModule) {
        await prisma.question.deleteMany({ where: { moduleId: existingSeamanshipModule.id } });
    }
    const seamanshipModule = await prisma.module.upsert({
        where: { slug: 'seamanship' },
        update: {},
        create: {
            name: 'Seamanship',
            slug: 'seamanship'
        }
    });
    for (const q of seamanshipQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                moduleId: seamanshipModule.id
            }
        });
    }

    // Seed Myship (General Knowledge)
    const myshipQuestions = require('./myship_questions.json');
    const existingMyshipModule = await prisma.module.findUnique({ where: { slug: 'myship' } });
    if (existingMyshipModule) {
        await prisma.question.deleteMany({ where: { moduleId: existingMyshipModule.id } });
    }
    const myshipModule = await prisma.module.upsert({
        where: { slug: 'myship' },
        update: {},
        create: {
            name: 'General Knowledge (Myship)',
            slug: 'myship'
        }
    });
    for (const q of myshipQuestions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex,
                moduleId: myshipModule.id
            }
        });
    }

    console.log({ admin, navigationModule, marineModule, communicationModule, logisticsModule, seamanshipModule, myshipModule })

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
