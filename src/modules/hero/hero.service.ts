import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the hero section data
   * Creates default if doesn't exist
   */
  async getHero() {
    let hero = await this.prisma.hero.findUnique({
      where: { id: 'default' },
    });

    // Create default hero if not exists
    if (!hero) {
      hero = await this.prisma.hero.create({
        data: {
          id: 'default',
          initials: 'JC',
          fullName: 'Jhon Mark Carizon',
          title: 'Web Developer',
          location: 'Mandaue City, Cebu, Philippines',
          gradientFrom: '#667eea',
          gradientTo: '#764ba2',
          stats: [
            { label: 'Years', value: '8+' },
            { label: 'Projects', value: '50+' },
            { label: 'Clients', value: '10+' },
            { label: 'Companies', value: '4' },
          ],
        },
      });
    }

    return hero;
  }

  /**
   * Update the hero section
   */
  async updateHero(dto: UpdateHeroDto) {
    // Ensure hero exists first
    await this.getHero();

    const { stats, ...rest } = dto;
    return this.prisma.hero.update({
      where: { id: 'default' },
      data: {
        ...rest,
        ...(stats !== undefined && { stats: stats as unknown as Prisma.InputJsonValue }),
      },
    });
  }
}
