import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto, ReorderExperienceDto } from './dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all experiences (optionally filter by visibility)
   */
  async getAllExperiences(includeHidden = false) {
    return this.prisma.experience.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single experience by ID
   */
  async getExperienceById(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return experience;
  }

  /**
   * Create a new experience
   */
  async createExperience(dto: CreateExperienceDto) {
    // Get the highest order value
    const maxOrder = await this.prisma.experience.aggregate({
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.experience.create({
      data: {
        jobTitle: dto.jobTitle,
        company: dto.company,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        description: dto.description,
        isVisible: dto.isVisible ?? true,
        order: dto.order ?? newOrder,
      },
    });
  }

  /**
   * Update an experience
   */
  async updateExperience(id: string, dto: UpdateExperienceDto) {
    await this.getExperienceById(id); // Verify exists

    const data: any = { ...dto };
    
    // Handle date conversions
    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate !== undefined) {
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an experience
   */
  async deleteExperience(id: string) {
    await this.getExperienceById(id); // Verify exists

    return this.prisma.experience.delete({
      where: { id },
    });
  }

  /**
   * Reorder experiences
   */
  async reorderExperiences(dto: ReorderExperienceDto) {
    const updates = dto.items.map((item, index) =>
      this.prisma.experience.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await this.prisma.$transaction(updates);

    return this.getAllExperiences(true);
  }

  /**
   * Toggle experience visibility
   */
  async toggleVisibility(id: string) {
    const experience = await this.getExperienceById(id);

    return this.prisma.experience.update({
      where: { id },
      data: { isVisible: !experience.isVisible },
    });
  }
}