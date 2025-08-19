// src/bookings/dtos/create-booking.dto.ts
import { IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  computerId!: string;

  @IsString()
  userId!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsString()
  username!: string;

  @IsString()
  computerName!: string;

}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  status?: 'active' | 'completed' | 'cancelled';

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  computerName?: string;
}