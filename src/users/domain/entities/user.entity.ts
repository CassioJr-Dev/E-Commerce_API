import { Entity } from "@/shared/domain/entities/entity";
import { UserValidatorFactory } from "../validators/user-validator";

export type UserProps = {
  name: string;
  isSeller: boolean;
  email: string;
  password: string;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
    created_at?: Date,
    update_at?: Date,
  ) {
    super(props, id, created_at, update_at);
  }

  updateName(value: string): void {
    UserEntity.validate({
      ...this.props,
      name: value
    })
    this.name = value;
  }

  updateIsSeller(value: boolean): void {
    UserEntity.validate({
      ...this.props,
      isSeller: value
    })
    this.isSeller = value;
  }

  updateEmail(value: string): void {
    UserEntity.validate({
      ...this.props,
      email: value
    })
    this.email = value;
  }

  updatePassword(value: string): void {
    UserEntity.validate({
      ...this.props,
      password: value
    })
    this.password = value;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get isSeller() {
    return this.props.isSeller;
  }

  private set isSeller(value: boolean) {
    this.props.isSeller = value;
  }

  get email() {
    return this.props.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  get password() {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create()
    validator.validate(props)
  }
}
