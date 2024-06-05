import { faker } from '@faker-js/faker';
import { ProductProps } from '../../entities/product.entity';
import { randomUUID } from 'node:crypto';

type Props = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  user_id?: string;
};

export function ProductDataBuilder(props: Props): ProductProps {
  return {
    name: props.name ?? faker.commerce.product(),
    description: props.description ?? 'description of product',
    price: props.price ?? Number(faker.finance.amount({ max: 200 })),
    stock: props.stock ?? faker.number.int({ max: 50 }),
    user_id: props.user_id ?? randomUUID(),
  };
}
