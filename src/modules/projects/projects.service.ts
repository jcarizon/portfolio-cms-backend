import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ReorderProjectsDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all projects (optionally filter by visibility)
   */
  async getAllProjects(includeHidden = false) {
    return this.prisma.project.findMany({
      where: includeHidden ? {} : { isVisible: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
  }

  /**
   * Get a single project by ID
   */
  async getProjectById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  /**
   * Create a new project
   */
  async createProject(dto: CreateProjectDto) {
    // Get the highest order value
    const maxOrder = await this.prisma.project.aggregate({
      _max: { order: true },
    });
    const newOrder = (maxOrder._max.order ?? -1) + 1;

    return this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        details: dto.details,
        imageUrl: dto.imageUrl,
        liveUrl: dto.liveUrl,
        githubUrl: dto.githubUrl,
        techStack: dto.techStack || [],
        featured: dto.featured ?? false,
        isVisible: dto.isVisible ?? true,
        order: dto.order ?? newOrder,
      },
    });
  }

  /**
   * Update a project
   */
  async updateProject(id: string, dto: UpdateProjectDto) {
    await this.getProjectById(id); // Verify exists

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string) {
    await this.getProjectById(id); // Verify exists

    return this.prisma.project.delete({
      where: { id },
    });
  }

  /**
   * Reorder projects
   */
  async reorderProjects(dto: ReorderProjectsDto) {
    const updates = dto.items.map((item, index) =>
      this.prisma.project.update({
        where: { id: item.id },
        data: { order: index },
      })
    );

    await this.prisma.$transaction(updates);

    return this.getAllProjects(true);
  }

  /**
   * Toggle project visibility
   */
  async toggleVisibility(id: string) {
    const project = await this.getProjectById(id);

    return this.prisma.project.update({
      where: { id },
      data: { isVisible: !project.isVisible },
    });
  }

  /**
   * Toggle project featured status
   */
  async toggleFeatured(id: string) {
    const project = await this.getProjectById(id);

    return this.prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
    });
  }
}