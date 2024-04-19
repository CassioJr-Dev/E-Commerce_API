import { Entity } from '@/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user-validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

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
    UserEntity.validate(props);
    super(props, id, created_at, update_at);
  }

  updateName(value: string): void {
    UserEntity.validate({
      ...this.props,
      name: value,
    });
    this.name = value;
    this.update_at = this.toDate();
  }

  updateIsSeller(value: boolean): void {
    UserEntity.validate({
      ...this.props,
      isSeller: value,
    });
    this.isSeller = value;
    this.update_at = this.toDate();
  }

  updateEmail(value: string): void {
    UserEntity.validate({
      ...this.props,
      email: value,
    });
    this.email = value;
    this.update_at = this.toDate();
  }

  updatePassword(value: string): void {
    UserEntity.validate({
      ...this.props,
      password: value,
    });
    this.password = value;
    this.update_at = this.toDate();
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
    const validator = UserValidatorFactory.create();
    const isValidate = validator.validate(props);
    if (!isValidate) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
