import { PrismaClient, Role, InstituteStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Create the NexaGrid Operations Institute (Your Internal Ops)
    const opsInstitute = await prisma.institute.upsert({
        where: { domain: 'ops.nexgenos.in' },
        update: {},
        create: {
            name: 'NexaGrid Operations',
            domain: 'ops.nexgenos.in',
            status: 'ACTIVE',
        },
    });

    // 2. Create your God Mode Admin
    await prisma.user.upsert({
        where: { email: 'admin@nexgenos.in' }, // Change this to your email
        update: {},
        create: {
            name: 'Global Administrator',
            email: 'admin@nexgenos.in',
            role: 'SUPERADMIN',
            instituteId: opsInstitute.id,
        },
    });

    // 3. Create a Demo Coaching Institute
    const demoInstitute = await prisma.institute.upsert({
        where: { domain: 'scholars.nexgenos.in' },
        update: {},
        create: {
            name: 'Scholars Coaching Point',
            domain: 'scholars.nexgenos.in',
            status: 'ACTIVE',
        },
    });

    console.log('✅ Seeding complete!');
    console.log(`Created Institute: ${opsInstitute.name}`);
    console.log(`Created Institute: ${demoInstitute.name}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });