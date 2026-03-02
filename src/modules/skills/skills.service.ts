import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
  CreateSkillDto,
  UpdateSkillDto,
  ReorderSkillsDto,
} from './dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CATEGORIES
  // ============================================

  /**
   * Get all skill categories with their skills
   */
  async getAllCategories() {
    return this.prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string) {
    const category = await this.prisma.skillCategory.findUnique({
      where: { id },
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Create a new skill category
   */
  async createCategory(dto: CreateSkillCategoryDto) {
    // Get the highest order value
    const maxOrder = await this.prisma.skillCategory.aggregate({
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.skillCategory.create({
      data: {
        name: dto.name,
        order: dto.order ?? newOrder,
      },
      include: {
        skills: true,
      },
    });
  }

  /**
   * Update a skill category
   */
  async updateCategory(id: string, dto: UpdateSkillCategoryDto) {
    await this.getCategoryById(id); // Verify exists

    return this.prisma.skillCategory.update({
      where: { id },
      data: dto,
      include: {
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  /**
   * Delete a skill category (cascades to skills)
   */
  async deleteCategory(id: string) {
    await this.getCategoryById(id); // Verify exists

    return this.prisma.skillCategory.delete({
      where: { id },
    });
  }

  /**
   * Reorder categories
   */
  async reorderCategories(dto: ReorderSkillsDto) {
    const updates = dto.items.map((item, index) =>
      this.prisma.skillCategory.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await this.prisma.$transaction(updates);

    return this.getAllCategories();
  }

  // ============================================
  // SKILLS
  // ============================================

  /**
   * Create a new skill
   */
  async createSkill(dto: CreateSkillDto) {
    // Verify category exists
    await this.getCategoryById(dto.categoryId);

    // Get the highest order value in this category
    const maxOrder = await this.prisma.skill.aggregate({
      where: { categoryId: dto.categoryId },
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.skill.create({
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        order: dto.order ?? newOrder,
      },
    });
  }

  /**
   * Update a skill
   */
  async updateSkill(id: string, dto: UpdateSkillDto) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.prisma.skill.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a skill
   */
  async deleteSkill(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.prisma.skill.delete({
      where: { id },
    });
  }

  /**
   * Reorder skills within a category
   */
  async reorderSkills(categoryId: string, dto: ReorderSkillsDto) {
    await this.getCategoryById(categoryId); // Verify category exists

    const updates = dto.items.map((item, index) =>
      this.prisma.skill.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await this.prisma.$transaction(updates);

    return this.getCategoryById(categoryId);
  }
}