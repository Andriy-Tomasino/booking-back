import { IsString } from 'class-validator';

export class CreatePendingUserDto {
  @IsString()
  idToken!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  nickname!: string;
}