import { Entity } from '@/shared/domain/entities/entity';
import { ProductValidatorFactory } from '../validator/product-validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type ProductProps = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  user_id: string;
};

export class ProductEntity extends Entity<ProductProps> {
  constructor(
    public readonly props: ProductProps,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    ProductEntity.validate(props);
    super(props, id, created_at, updated_at);
  }

  updateName(value: string): void {
    ProductEntity.validate({
      ...this.props,
      name: value,
    });
    this.name = value;
    this.updated_at = this.toDate();
  }

  updateDescription(value: string): void {
    ProductEntity.validate({
      ...this.props,
      description: value,
    });
    this.description = value;
    this.updated_at = this.toDate();
  }

  updatePrice(value: number): void {
    ProductEntity.validate({
      ...this.props,
      price: value,
    });
    this.price = value;
    this.updated_at = this.toDate();
  }

  updateStock(value: number): void {
    ProductEntity.validate({
      ...this.props,
      stock: value,
    });
    this.stock = value;
    this.updated_at = this.toDate();
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value;
  }

  get price() {
    return this.props.price;
  }

  private set price(value: number) {
    this.props.price = value;
  }

  get stock() {
    return this.props.stock;
  }

  private set stock(value: number) {
    this.props.stock = value;
  }

  get user_id() {
    return this.props.user_id;
  }

  private set user_id(value: string) {
    this.props.user_id = value;
  }

  static validate(props: ProductProps) {
    const validator = ProductValidatorFactory.create();
    const isValidate = validator.validate(props);
    if (!isValidate) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
