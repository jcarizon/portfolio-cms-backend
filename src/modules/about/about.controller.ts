import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('About Section')
@Controller('about')
export class AboutController {
  constructor(private aboutService: AboutService) {}

  /**
   * PUBLIC: Get about section data for portfolio display
   */
  @Get()
  @ApiOperation({ summary: 'Get about section data (public)' })
  @ApiResponse({ status: 200, description: 'About data retrieved' })
  async getAbout() {
    return this.aboutService.getAbout();
  }

  /**
   * ADMIN: Update about section
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update about section (admin only)' })
  @ApiResponse({ status: 200, description: 'About updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAbout(@Body() dto: UpdateAboutDto) {
    return this.aboutService.updateAbout(dto);
  }
}