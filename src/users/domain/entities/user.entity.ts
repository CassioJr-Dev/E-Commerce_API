import { Entity } from "@/shared/domain/entities/entity";

export type UserProps = {
  name: string;
  isSeller: boolean;
  email: string;
  password: string;
  created_at?: Date,
  update_at?: Date
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
    this.name = value;
  }

  updateIsSeller(value: boolean): void {
    this.isSeller = value;
  }

  updateEmail(value: string): void {
    this.email = value;
  }

  updatePassword(value: string): void {
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
}
