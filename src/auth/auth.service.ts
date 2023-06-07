import { UsersService } from '../users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users_Table } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    user_name: string,
    password: string,
  ): Promise<any> {
    const user = await this.usersService.getOneUser(user_name, password);
    if (!user) {
      return null;
    }
    return user;
  }

  async loginWithCredentials(user: Users_Table) {
    const payload = { user_name: user.user_name };
    if (!payload) {
      return null;
    }
    return {
      user_name: user.user_name,
      id: user.id,
      access_token: this.jwtService.sign(payload),
      expiredAt: Date.now() + 60000,
    };
  }
}
