import { Entity } from "@/shared/infrastructure/domain/entities/entity"

export type UserProps = {
  name: string
  isSeller: boolean
  email: string
  password: string
}

export class UserEntity extends Entity<UserProps>{
  constructor(public readonly props: UserProps, id?:string, created_at?: Date, update_at?: Date ) {
    super(props, id, created_at, update_at)
  }

  get name() {
    return this.props.name
  }

  get isSeller() {
    return this.props.isSeller
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

}
