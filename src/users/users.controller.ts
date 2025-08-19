// users/users.controller.ts
import { Controller, Post, Body, Get, Request, UseGuards, HttpException, HttpStatus, Put, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async checkOrCreateUser(@Request() req, @Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.findOne(createUserDto.uid);
      return {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };
    } catch (error) {
      if ((error as any).status === HttpStatus.NOT_FOUND) {
        const newUser = await this.usersService.create(createUserDto);
        return {
          uid: newUser.uid,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          nickname: newUser.nickname,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
        };
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.updateProfile(req.user.uid, updateUserDto); // Изменено на uid
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    try {
      const user = await this.usersService.findOne(req.user.uid);
      return {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to fetch user', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const users = await this.usersService.findAll();
    return users.map(user => ({
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    await this.usersService.deleteUser(uid);
    return { message: 'User deleted successfully' };
  }
}