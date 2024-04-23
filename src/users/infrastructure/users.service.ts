import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class UsersService {
  create(signupDto: SignupDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
