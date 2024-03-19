import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"
import { UserProps } from "../entities/user.entity"
import { ClassValidatorFields } from "@/shared/domain/validators/class-validator-fileds"

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsBoolean()
  @IsOptional()
  isSeller: boolean

  @MaxLength(255)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  password: string

  @IsDate()
  @IsOptional()
  created_at: Date

  @IsDate()
  @IsOptional()
  update_at: Date

  constructor({ name, isSeller, email, password, created_at, update_at }: UserProps) {
    Object.assign(this, { name, isSeller, email, password, created_at, update_at })
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserRules): boolean {
    return super.validate(new UserRules(data ?? ({} as UserProps)))
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator()
  }
}
