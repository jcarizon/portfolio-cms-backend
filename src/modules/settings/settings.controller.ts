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
import { SettingsService } from './settings.service';
import {
  UpdateSiteSettingsDto,
  UpdateContactSettingsDto,
  CreateContactMessageDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // ============================================
  // SITE SETTINGS
  // ============================================

  @Get('site')
  @ApiOperation({ summary: 'Get site settings (public)' })
  @ApiResponse({ status: 200, description: 'Site settings retrieved' })
  async getSiteSettings() {
    return this.settingsService.getSiteSettings();
  }

  @Put('site')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update site settings (admin only)' })
  @ApiResponse({ status: 200, description: 'Site settings updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSiteSettings(@Body() dto: UpdateSiteSettingsDto) {
    return this.settingsService.updateSiteSettings(dto);
  }

  // ============================================
  // CONTACT SETTINGS
  // ============================================

  @Get('contact')
  @ApiOperation({ summary: 'Get contact settings (public)' })
  @ApiResponse({ status: 200, description: 'Contact settings retrieved' })
  async getContactSettings() {
    return this.settingsService.getContactSettings();
  }

  @Put('contact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact settings (admin only)' })
  @ApiResponse({ status: 200, description: 'Contact settings updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateContactSettings(@Body() dto: UpdateContactSettingsDto) {
    return this.settingsService.updateContactSettings(dto);
  }

  // ============================================
  // CONTACT MESSAGES
  // ============================================

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all contact messages (admin only)' })
  @ApiResponse({ status: 200, description: 'Messages retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getContactMessages() {
    return this.settingsService.getContactMessages();
  }

  @Get('messages/unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread message count (admin only)' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUnreadCount() {
    const count = await this.settingsService.getUnreadCount();
    return { count };
  }

  @Post('messages')
  @ApiOperation({ summary: 'Submit a contact message (public)' })
  @ApiResponse({ status: 201, description: 'Message submitted' })
  async createContactMessage(@Body() dto: CreateContactMessageDto) {
    return this.settingsService.createContactMessage(dto);
  }

  @Put('messages/:id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark message as read (admin only)' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAsRead(@Param('id') id: string) {
    return this.settingsService.markAsRead(id);
  }

  @Put('messages/mark-all-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all messages as read (admin only)' })
  @ApiResponse({ status: 200, description: 'All messages marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead() {
    return this.settingsService.markAllAsRead();
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a message (admin only)' })
  @ApiResponse({ status: 200, description: 'Message deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteMessage(@Param('id') id: string) {
    return this.settingsService.deleteMessage(id);
  }
}