import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ReorderProjectsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects (public)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Projects retrieved' })
  async getAllProjects(@Query('all') includeHidden?: string) {
    return this.projectsService.getAllProjects(includeHidden === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project (admin only)' })
  @ApiResponse({ status: 201, description: 'Project created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(dto);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder projects (admin only)' })
  @ApiResponse({ status: 200, description: 'Projects reordered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorderProjects(@Body() dto: ReorderProjectsDto) {
    return this.projectsService.reorderProjects(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project (admin only)' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, dto);
  }

  @Put(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle project visibility (admin only)' })
  @ApiResponse({ status: 200, description: 'Visibility toggled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleVisibility(@Param('id') id: string) {
    return this.projectsService.toggleVisibility(id);
  }

  @Put(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle project featured status (admin only)' })
  @ApiResponse({ status: 200, description: 'Featured status toggled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleFeatured(@Param('id') id: string) {
    return this.projectsService.toggleFeatured(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project (admin only)' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }
}