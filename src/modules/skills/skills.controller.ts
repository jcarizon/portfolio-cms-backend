import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import {
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
  CreateSkillDto,
  UpdateSkillDto,
  ReorderSkillsDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  // ============================================
  // CATEGORIES
  // ============================================

  @Get()
  @ApiOperation({ summary: 'Get all skill categories with skills (public)' })
  @ApiResponse({ status: 200, description: 'Skills retrieved' })
  async getAllCategories() {
    return this.skillsService.getAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a single category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategoryById(@Param('id') id: string) {
    return this.skillsService.getCategoryById(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill category (admin only)' })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createCategory(@Body() dto: CreateSkillCategoryDto) {
    return this.skillsService.createCategory(dto);
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill category (admin only)' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateSkillCategoryDto,
  ) {
    return this.skillsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill category (admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id') id: string) {
    return this.skillsService.deleteCategory(id);
  }

  @Put('categories/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder skill categories (admin only)' })
  @ApiResponse({ status: 200, description: 'Categories reordered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorderCategories(@Body() dto: ReorderSkillsDto) {
    return this.skillsService.reorderCategories(dto);
  }

  // ============================================
  // SKILLS
  // ============================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill (admin only)' })
  @ApiResponse({ status: 201, description: 'Skill created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSkill(@Body() dto: CreateSkillDto) {
    return this.skillsService.createSkill(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill (admin only)' })
  @ApiResponse({ status: 200, description: 'Skill updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async updateSkill(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillsService.updateSkill(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill (admin only)' })
  @ApiResponse({ status: 200, description: 'Skill deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async deleteSkill(@Param('id') id: string) {
    return this.skillsService.deleteSkill(id);
  }

  @Put('categories/:categoryId/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder skills within a category (admin only)' })
  @ApiResponse({ status: 200, description: 'Skills reordered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorderSkills(
    @Param('categoryId') categoryId: string,
    @Body() dto: ReorderSkillsDto,
  ) {
    return this.skillsService.reorderSkills(categoryId, dto);
  }
}