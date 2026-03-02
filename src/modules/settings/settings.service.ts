import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { UpdateContactSettingsDto } from './dto/update-contact-settings.dto';

// In-memory rate limit store: email -> timestamps of submissions
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 messages per hour per email

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // SITE SETTINGS
  // ============================================

  async getSiteSettings() {
    let settings = await this.prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          id: 'default',
          siteTitle: 'Portfolio',
          siteTagline: 'Web Developer',
          githubUrl: '',
          linkedinUrl: '',
          twitterUrl: '',
          portfolioUrl: '',
          footerText: '© 2025 All rights reserved.',
        },
      });
    }

    return settings;
  }

  async updateSiteSettings(dto: UpdateSiteSettingsDto) {
    await this.getSiteSettings();
    return this.prisma.siteSettings.update({
      where: { id: 'default' },
      data: dto,
    });
  }

  // ============================================
  // CONTACT SETTINGS
  // ============================================

  async getContactSettings() {
    let settings = await this.prisma.contactSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.contactSettings.create({
        data: {
          id: 'default',
          heading: 'Get In Touch',
          description:
            "I'm always open to discussing new opportunities, interesting projects, or potential collaborations.",
          email: 'hello@example.com',
          buttonText: 'Send Message',
          showSubjectField: true,
          requireSubject: false,
        },
      });
    }

    return settings;
  }

  async updateContactSettings(dto: UpdateContactSettingsDto) {
    await this.getContactSettings();
    return this.prisma.contactSettings.update({
      where: { id: 'default' },
      data: dto,
    });
  }

  // ============================================
  // CONTACT MESSAGES
  // ============================================

  async getContactMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount() {
    return this.prisma.contactMessage.count({
      where: { isRead: false },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead() {
    await this.prisma.contactMessage.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async deleteMessage(id: string) {
    return this.prisma.contactMessage.delete({ where: { id } });
  }

  async createContactMessage(data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const email = data.email.toLowerCase().trim();
    const now = Date.now();

    // Rate limiting: max RATE_LIMIT_MAX submissions per RATE_LIMIT_WINDOW_MS per email
    const timestamps = (rateLimitStore.get(email) || []).filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS,
    );

    if (timestamps.length >= RATE_LIMIT_MAX) {
      throw new HttpException(
        'Too many messages sent. Please wait before sending another.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    rateLimitStore.set(email, [...timestamps, now]);

    return this.prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        isRead: false,
      },
    });
  }
}
