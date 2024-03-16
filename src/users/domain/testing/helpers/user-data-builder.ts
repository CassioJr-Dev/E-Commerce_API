import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

type Props = {
  name?: string;
  isSeller?: boolean;
  email?: string;
  password?: string;
};

export function UserDataBuilder(props: Props): UserProps {
  return {
    name: props.name ?? faker.person.fullName(),
    isSeller: props.isSeller ?? false,
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
  };
}
