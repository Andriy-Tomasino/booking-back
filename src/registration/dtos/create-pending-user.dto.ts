// src/registration/dtos/create-pending-user.dto.ts
import { IsString } from 'class-validator';

export class CreatePendingUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  nickname!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  password!: string;
}