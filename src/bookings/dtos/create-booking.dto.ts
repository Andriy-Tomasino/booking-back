import { IsMongoId, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  computerId!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;
}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  startTime!: string;

  @IsDateString()
  @IsOptional()
  endTime!: string;

  @IsString()
  @IsOptional()
  status ?: 'active' | 'completed' | 'cancelled';
}