import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '../../entities/enums';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field(() => Role, { defaultValue: Role.Patient })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  isOtpOnly?: boolean;
}
