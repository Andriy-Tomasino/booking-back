// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  uid!: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  phoneNumber?: string;
  password?: string;
  role?: string;
}