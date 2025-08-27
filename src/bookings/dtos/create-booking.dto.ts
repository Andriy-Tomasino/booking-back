// src/bookings/dtos/create-booking.dto.ts
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  computerId!: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  computerName!: string;
}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  // Добавьте другие поля, если нужно обновлять (например, status, username и т.д.)
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  computerName?: string;
}