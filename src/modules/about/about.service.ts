import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';

export interface AboutParagraph {
  id: string;
  text: string;
  order: number;
}

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the about section data
   * Creates default if doesn't exist
   */
  async getAbout() {
    let about = await this.prisma.about.findUnique({
      where: { id: 'default' },
    });

    // Create default about if not exists
    if (!about) {
      about = await this.prisma.about.create({
        data: {
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
    }

    return about;
  }

  /**
   * Update the about section
   */
  async updateAbout(dto: UpdateAboutDto) {
    // Ensure about exists first
    await this.getAbout();

    // Validate and normalize the content
    const normalizedContent = dto.content.map((p, index) => ({
      id: p.id || this.generateId(),
      text: p.text,
      order: p.order ?? index,
    }));

    // Sort by order
    normalizedContent.sort((a, b) => a.order - b.order);

    return this.prisma.about.update({
      where: { id: 'default' },
      data: {
        content: normalizedContent,
      },
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}