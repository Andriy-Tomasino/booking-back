import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreatePendingUserDto } from './dtos/create-pending-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  createPending(@Body() dto: CreatePendingUserDto) {
    return this.registrationsService.createPending(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPending() {
    return this.registrationsService.getAllPending();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.registrationsService.approve(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  reject(@Param('id') id: string) {
    return this.registrationsService.reject(id);
  }
}