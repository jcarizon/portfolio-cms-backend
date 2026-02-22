import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Hero Section')
@Controller('hero')
export class HeroController {
  constructor(private heroService: HeroService) {}

  /**
   * PUBLIC: Get hero section data for portfolio display
   */
  @Get()
  @ApiOperation({ summary: 'Get hero section data (public)' })
  @ApiResponse({ status: 200, description: 'Hero data retrieved' })
  async getHero() {
    return this.heroService.getHero();
  }

  /**
   * ADMIN: Update hero section
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hero section (admin only)' })
  @ApiResponse({ status: 200, description: 'Hero updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateHero(@Body() dto: UpdateHeroDto) {
    return this.heroService.updateHero(dto);
  }
}
