import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ============================================
  // LOCAL AUTHENTICATION
  // ============================================

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // Create admin
    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        provider: 'local',
      },
    });

    return this.generateAuthResponse(admin);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!admin || !admin.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(admin);
  }

  // ============================================
  // GOOGLE OAUTH
  // ============================================

  async validateGoogleUser(profile: {
    id: string;
    email: string;
    displayName: string;
    photos?: { value: string }[];
  }): Promise<AuthResponse> {
    const { id, email, displayName, photos } = profile;
    const avatarUrl = photos?.[0]?.value || null;

    // Find or create admin
    let admin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ providerId: id }, { email }],
      },
    });

    if (admin) {
      // Update existing admin with OAuth info if needed
      admin = await this.prisma.admin.update({
        where: { id: admin.id },
        data: {
          provider: 'google',
          providerId: id,
          avatarUrl: avatarUrl || admin.avatarUrl,
        },
      });
    } else {
      // Check if this is the first admin (auto-approve)
      // or if we need to restrict registration
      const adminCount = await this.prisma.admin.count();
      
      if (adminCount > 0) {
        // Only allow existing emails to login via OAuth
        throw new UnauthorizedException(
          'No account found with this email. Please contact the administrator.',
        );
      }

      // Create first admin
      admin = await this.prisma.admin.create({
        data: {
          email,
          name: displayName,
          avatarUrl,
          provider: 'google',
          providerId: id,
        },
      });
    }

    return this.generateAuthResponse(admin);
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  async validateToken(payload: JwtPayload) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return admin;
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        provider: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return admin;
  }

  // ============================================
  // HELPERS
  // ============================================

  private generateAuthResponse(admin: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  }): AuthResponse {
    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        avatarUrl: admin.avatarUrl,
      },
    };
  }
}
