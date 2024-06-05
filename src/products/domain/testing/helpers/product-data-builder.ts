import { faker } from '@faker-js/faker';
import { ProductProps } from '../../entities/product.entity';
import { randomUUID } from 'node:crypto';

type Props = {
  name?: string;
  description?: string;
  price?: number;
  user_id?: string;
};

export function ProductDataBuilder(props: Props): ProductProps {
  return {
    name: props.name ?? faker.commerce.product(),
    description: props.description ?? 'description of product',
    price: props.price ?? Number(faker.finance.amount()),
    user_id: props.user_id ?? randomUUID(),
  };
}
