import { IsNotEmpty, IsString, IsOptional } from '@nestjs/class-validator';
import { IsBoolean } from 'class-validator';

export class CreateComputerDto{
  @IsString()
  @IsNotEmpty()
  name !: string;

  @IsString()
  @IsNotEmpty()
  location !: string;

  @IsString()
  @IsNotEmpty()
  outletId !: string;
}

export class UpdateComputerDto{
  @IsString()
  @IsOptional()
  name ?: string;

  @IsString()
  @IsOptional()
  location ?: string;

  @IsString()
  @IsOptional()
  outletId ?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}