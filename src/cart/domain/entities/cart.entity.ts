import { Entity } from "@/shared/domain/entities/entity";

export type CartProps = {
  user_id: string
};

export class CartEntity extends Entity<CartProps>{
  constructor(
    public readonly props: CartProps,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
  ){
    super(props, id, created_at, updated_at);
  }

  get user_id() {
    return this.props.user_id
  }

  set user_id(value: string) {
    this.props.user_id = value
  }
}
