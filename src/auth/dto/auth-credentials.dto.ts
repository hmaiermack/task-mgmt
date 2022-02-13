import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Unique } from 'typeorm';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase, one lowercase, and at least one number or special character.',
  })
  password: string;
}
