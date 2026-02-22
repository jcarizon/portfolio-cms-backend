import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // CREATE DEFAULT ADMIN
  // ============================================
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'jhonmarkcarizon@gmail.com' },
    update: {},
    create: {
      email: 'jhonmarkcarizon@gmail.com',
      password: hashedPassword,
      name: 'Jhon Mark Carizon',
      provider: 'local',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ============================================
  // SITE SETTINGS
  // ============================================
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteTitle: 'Jm - Web Developer',
      siteTagline: 'Building modern web experiences',
      githubUrl: 'https://github.com/jcarizon',
      portfolioUrl: 'https://jmcarizon.vercel.app/',
      footerText: '© 2025 Jhon Mark Carizon. All rights reserved.',
    },
  });
  console.log('✅ Site settings created');

  // ============================================
  // HERO SECTION
  // ============================================
  const hero = await prisma.hero.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      initials: 'JC',
      fullName: 'Jhon Mark Carizon',
      title: 'Web Developer',
      location: 'Mandaue City, Cebu, Philippines',
      gradientFrom: '#667eea',
      gradientTo: '#764ba2',
    },
  });
  console.log('✅ Hero section created');

  // ============================================
  // ABOUT SECTION
  // ============================================
  const about = await prisma.about.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      content: [
        {
          id: '1',
          text: 'Web developer with 8+ years of experience in building ERP, HRIS, and e-commerce platforms using Vue, React, Node.js, Laravel, and AWS. Skilled in leading frontend teams, optimizing UI performance, and delivering scalable cloud-based apps.',
          order: 0,
        },
        {
          id: '2',
          text: 'Mainly a frontend engineer but solid knowledge about backend technologies like PHP, Nest, and Express. Currently working as a solo mobile developer on LeadAI, building AI-powered solutions with React Native and Redux Toolkit.',
          order: 1,
        },
      ],
    },
  });
  console.log('✅ About section created');

  // ============================================
  // SKILLS
  // ============================================
  const frontendCategory = await prisma.skillCategory.create({
    data: {
      name: 'Frontend',
      order: 0,
      skills: {
        create: [
          { name: 'Vue.js', order: 0 },
          { name: 'Nuxt.js', order: 1 },
          { name: 'React', order: 2 },
          { name: 'Next.js', order: 3 },
          { name: 'React Native', order: 4 },
          { name: 'Angular', order: 5 },
          { name: 'Tailwind', order: 6 },
          { name: 'SASS', order: 7 },
          { name: 'Redux', order: 8 },
        ],
      },
    },
  });

  const backendCategory = await prisma.skillCategory.create({
    data: {
      name: 'Backend & Database',
      order: 1,
      skills: {
        create: [
          { name: 'Node.js', order: 0 },
          { name: 'PHP', order: 1 },
          { name: 'Laravel', order: 2 },
          { name: 'REST API', order: 3 },
          { name: 'PostgreSQL', order: 4 },
          { name: 'MySQL', order: 5 },
        ],
      },
    },
  });

  const toolsCategory = await prisma.skillCategory.create({
    data: {
      name: 'Tools & Platforms',
      order: 2,
      skills: {
        create: [
          { name: 'AWS Lambda', order: 0 },
          { name: 'Amplify', order: 1 },
          { name: 'Vitest', order: 2 },
          { name: 'Vite', order: 3 },
          { name: 'Figma', order: 4 },
          { name: 'WordPress', order: 5 },
          { name: 'Git', order: 6 },
          { name: 'Asana', order: 7 },
          { name: 'Trello', order: 8 },
        ],
      },
    },
  });
  console.log('✅ Skills created');

  // ============================================
  // PROJECTS
  // ============================================
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'LeadAI',
        description: 'Solo mobile developer with full ownership of the app, from planning to structure to publishing.',
        details: 'AI-powered mobile application for lead generation.',
        techStack: ['React Native', 'Redux Toolkit'],
        featured: true,
        order: 0,
      },
      {
        title: 'Dental System SaaS',
        description: 'Comprehensive dental practice management system with booking appointments and separate portals for dentists and patients.',
        details: 'Currently in progress.',
        techStack: ['Next.js', 'Nest.js', 'Redux Toolkit', 'PostgreSQL'],
        featured: true,
        order: 1,
      },
      {
        title: 'Colegio de Sto. Tomas-Recoletos Enrollment System',
        description: 'Full-featured enrollment management system for educational institution.',
        details: 'Freelance project currently in progress.',
        techStack: ['Laravel', 'Vue.js', 'MySQL', 'SCSS'],
        featured: true,
        order: 2,
      },
      {
        title: 'Invoicer & LMS',
        description: 'Attendance checker with hourly computation for time tracking and learning management.',
        details: 'Personal projects in development.',
        techStack: ['React Native', 'React', 'Nest.js', 'Firebase'],
        featured: false,
        order: 3,
      },
    ],
  });
  console.log('✅ Projects created');

  // ============================================
  // EXPERIENCE
  // ============================================
  const experiences = await prisma.experience.createMany({
    data: [
      {
        jobTitle: 'Mobile Developer',
        company: 'LeadAi',
        location: 'Remote',
        startDate: new Date('2025-09-01'),
        endDate: null, // Present
        description: 'Solo mobile developer with full ownership of the app, from planning to structure to publishing. Building AI-powered mobile solutions using React Native and Redux Toolkit.',
        order: 0,
      },
      {
        jobTitle: 'Software Engineer',
        company: 'Cody Web Development',
        location: 'Cebu City',
        startDate: new Date('2022-03-01'),
        endDate: new Date('2025-09-01'),
        description: 'Led frontend development for large-scale ERP and HRIS systems. Supervised junior developers and reviewed PRs to ensure clean code standards. Authored functional specs and design documentation for client features.',
        order: 1,
      },
      {
        jobTitle: 'Web Developer',
        company: 'Glophics',
        location: 'Cebu City',
        startDate: new Date('2019-02-01'),
        endDate: new Date('2022-03-01'),
        description: 'Developed and maintained an in-house inventory and sales system tailored to business needs. Implemented frontend and backend features using PHP, Laravel, and Vue.js for seamless user experience.',
        order: 2,
      },
      {
        jobTitle: 'Web Developer',
        company: 'Proweaver',
        location: 'Cebu City',
        startDate: new Date('2017-03-01'),
        endDate: new Date('2019-02-01'),
        description: 'Developed and maintained personal, blog, and informational websites for various clients. Converted Figma/PSD designs into responsive WordPress themes and templates.',
        order: 3,
      },
    ],
  });
  console.log('✅ Experience created');

  // ============================================
  // CONTACT SETTINGS
  // ============================================
  const contact = await prisma.contactSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heading: 'Get In Touch',
      description: "I'm always open to discussing new opportunities, interesting projects, or potential collaborations.",
      email: 'jhonmarkcarizon@gmail.com',
      buttonText: 'Send me an email',
    },
  });
  console.log('✅ Contact settings created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Admin login: jhonmarkcarizon@gmail.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
