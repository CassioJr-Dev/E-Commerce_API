import { ProductEntity } from "@/products/domain/entities/product.entity";

export type ProductOutput = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export class ProductOutputMapper {
  static toOutput(entity: ProductEntity): ProductOutput {
    return entity.toJSON();
  }
}
