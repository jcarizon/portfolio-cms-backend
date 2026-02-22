import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HeroModule } from './modules/hero/hero.module';
import { AboutModule } from './modules/about/about.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { ContactModule } from './modules/contact/contact.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database connection
    PrismaModule,

    // Feature modules
    AuthModule,
    HeroModule,
    AboutModule,
    SkillsModule,
    ProjectsModule,
    ExperienceModule,
    ContactModule,
    SettingsModule,
  ],
})
export class AppModule {}
