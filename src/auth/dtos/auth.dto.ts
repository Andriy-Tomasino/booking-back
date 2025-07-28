import { IsString, IsNotEmpty, isString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken !: string;

  @IsString()
  @IsNotEmpty()
  email !: string;

  @IsString()
  name !: string;

  @IsString()
  role !: string;

  @IsString()
  @IsNotEmpty()
  _id !: string;

}