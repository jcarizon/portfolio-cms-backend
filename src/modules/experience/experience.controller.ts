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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto, UpdateExperienceDto, ReorderExperienceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all experiences (public)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Experiences retrieved' })
  async getAllExperiences(@Query('all') includeHidden?: string) {
    return this.experienceService.getAllExperiences(includeHidden === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single experience by ID' })
  @ApiResponse({ status: 200, description: 'Experience retrieved' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async getExperienceById(@Param('id') id: string) {
    return this.experienceService.getExperienceById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new experience (admin only)' })
  @ApiResponse({ status: 201, description: 'Experience created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createExperience(@Body() dto: CreateExperienceDto) {
    return this.experienceService.createExperience(dto);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder experiences (admin only)' })
  @ApiResponse({ status: 200, description: 'Experiences reordered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorderExperiences(@Body() dto: ReorderExperienceDto) {
    return this.experienceService.reorderExperiences(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an experience (admin only)' })
  @ApiResponse({ status: 200, description: 'Experience updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async updateExperience(
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experienceService.updateExperience(id, dto);
  }

  @Put(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle experience visibility (admin only)' })
  @ApiResponse({ status: 200, description: 'Visibility toggled' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleVisibility(@Param('id') id: string) {
    return this.experienceService.toggleVisibility(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an experience (admin only)' })
  @ApiResponse({ status: 200, description: 'Experience deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async deleteExperience(@Param('id') id: string) {
    return this.experienceService.deleteExperience(id);
  }
}