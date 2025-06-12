// prisma/seed.ts
import { PrismaClient, Role, TeamSpecialization } from '../src/backend/node_modules/@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create a default Admin User
  const saltRounds = 10;
  const adminPassword = 'password'; // Use a more secure password in real scenarios or env var
  const adminPasswordHash = await bcrypt.hash(adminPassword, saltRounds);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      preferences: { theme: 'dark' },
      teamMemberships: [],
      permissions: { "manage_all": true }
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create a default Technician User
  const techPassword = 'password';
  const techPasswordHash = await bcrypt.hash(techPassword, saltRounds);
  const techUser = await prisma.user.upsert({
    where: { email: 'technician@example.com'},
    update: {},
    create: {
      username: 'technician',
      email: 'technician@example.com',
      passwordHash: techPasswordHash,
      role: Role.TECHNICIAN,
      preferences: { theme: 'light' },
      teamMemberships: [],
      permissions: { "view_devices": true, "edit_own_tasks": true }
    }
  });
  console.log(`Created technician user: ${techUser.email}`);


  // Create a sample Team
  const towerTeam = await prisma.team.upsert({
    where: { name: 'Alpha Tower Climbers' },
    update: {},
    create: {
      name: 'Alpha Tower Climbers',
      teamType: TeamSpecialization.TOWER_CLIMBING,
      organization: 'Field Operations',
      contactInfo: { primary_phone: '555-0101', team_lead: 'John Doe' },
      skillMatrix: { "tower_climbing": "expert", "safety_protocols": "advanced" },
      certifications: [{ name: "Tower Climbing Safety", expiry: "2025-12-31", authority: "OSHA" }],
      availabilitySchedule: { "mon_fri": "07:00-16:00", "sat_sun": "on_call" },
      createdById: adminUser.id, // Link to the admin user
    },
  });
  console.log(`Created team: ${towerTeam.name}`);

  const configTeam = await prisma.team.upsert({
    where: { name: 'Bravo Configuration Specialists' },
    update: {},
    create: {
      name: 'Bravo Configuration Specialists',
      teamType: TeamSpecialization.CONFIGURATION,
      organization: 'Technical Support Unit',
      contactInfo: { primary_phone: '555-0202', team_lead: 'Jane Smith' },
      skillMatrix: { "tetra_radio_config": "expert", "ip_networking": "advanced", "system_integration": "intermediate" },
      certifications: [{ name: "Certified TETRA Engineer", expiry: "2026-06-30" }],
      availabilitySchedule: { "mon_fri": "09:00-18:00" },
      createdById: adminUser.id,
    }
  });
  console.log(`Created team: ${configTeam.name}`);

  // Add technician to Alpha Tower Climbers team
  await prisma.user.update({
    where: { id: techUser.id },
    data: {
      teamMemberships: {
        push: [{ teamId: towerTeam.id, teamName: towerTeam.name, role_in_team: "member" }]
      }
    }
  });
  console.log(`Added ${techUser.username} to ${towerTeam.name}`);


  // Create a sample Site
  const siteOne = await prisma.site.upsert({
    where: { name: 'Central Tower Site' },
    update: {},
    create: {
      name: 'Central Tower Site',
      address: '123 Main St, Anytown, USA',
      createdById: adminUser.id,
    }
  });
  console.log(`Created site: ${siteOne.name}`);

  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
