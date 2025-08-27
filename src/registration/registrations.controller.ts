import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreatePendingUserDto } from './dtos/create-pending-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  /** Создать pending пользователя (регистрация) */
  @Post()
  async createPending(@Body() dto: CreatePendingUserDto) {
    return this.registrationsService.createPending(dto);
  }

  /** Получить всех pending пользователей (только админ) */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPending() {
    return this.registrationsService.getAllPending();
  }

  /** Подтвердить pending пользователя (создать реального пользователя) */
  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    await this.registrationsService.approve(id);
    return { message: 'User approved successfully' };
  }

  /** Отклонить pending пользователя */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async reject(@Param('id') id: string) {
    await this.registrationsService.reject(id);
    return { message: 'User rejected successfully' };
  }
}
