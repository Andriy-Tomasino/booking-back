import { IsString, IsNotEmpty, isString } from 'class-validator';

export class AuthResponseDto {
  accessToken!: string;
  jwtToken?: string; // Опциональное поле для JWT
  email!: string;
  name!: string;
  role!: string;
  _id!: string;
}