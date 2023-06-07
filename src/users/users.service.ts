import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users_Table } from './users.entity';
import { Repository } from 'typeorm';
import { create_user_DTO } from './DTO/create_user.dto';
import { Profile } from './profile.entity';
import { create_profile_DTO } from './DTO/profile_user.dto';
import * as bcrypt from 'bcrypt';
import { ProfileEnum, ReqFavorites } from './DTO/response_profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users_Table)
    private User_Repository: Repository<Users_Table>,
    @InjectRepository(Profile)
    private User_Profile_Repository: Repository<Profile>,
  ) {}

  async createUser(user: create_user_DTO) {
    const user_found = await this.User_Repository.findOne({
      where: {
        user_name: user.user_name,
      },
    });
    const email_found = await this.User_Repository.findOne({
      where: {
        email: user.email,
      },
    });
    if (user_found || email_found) {
      return new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    const new_user = await this.User_Repository.create({
      user_name: user.user_name,
      password: hashedPassword,
      email: user.email,
      auth_strategy: 'JwtStrategy',
    });
    const response = await this.User_Repository.save(new_user);
    return {
      message: 'Success, now you can login',
      status: 200,
      data: response,
    };
  }

  getUsers() {
    return this.User_Repository.find();
  }

  async getOneUserPublic(req) {
    const relation_user = await this.User_Repository.find({
      relations: ['profile'],
      where: { id: req.id },
    });
    if (!relation_user) {
      return new HttpException(
        'We do not have that user here',
        HttpStatus.CONFLICT,
      );
    }
    const response = relation_user;
    return response;
  }

  async getOneUser(username, password) {
    const user_found = await this.User_Repository.findOne({
      where: { user_name: username },
    });
    if (!user_found) {
      return null;
    }
    const response = await bcrypt
      .compare(password, user_found.password)
      .then((isMatch) => {
        if (isMatch) {
          return user_found;
        } else {
          return null;
        }
      });
    return response;
  }

  deleteUser(id: number) {
    const user_found = this.User_Repository.findOne({ where: { id: id } });
    if (!user_found) {
      return new HttpException(
        'We do not have that user here',
        HttpStatus.CONFLICT,
      );
    }
    return this.User_Repository.delete({ id: id });
  }

  async addFavorites(id: number, favorites: ReqFavorites) {
    const new_favorites = favorites?.profile?.favorites;
    const relation_profile = await this.User_Profile_Repository.find({
      relations: ['user'],
      where: { id: Number(id) },
    });
    const updated_profile = await this.User_Profile_Repository.update(
      { id: relation_profile[0]?.id },
      {
        favorites: new_favorites,
      },
    );
    return { status: 200, data: updated_profile };
  }

  async addProfile(id: number, profile: ProfileEnum) {
    const profile_to_create = new Profile();
    const user_found = await this.User_Repository.findOne({
      where: { id: Number(id) },
    });
    const relation_profile = await this.User_Profile_Repository.find({
      relations: ['user'],
      where: { id: Number(id) },
    });
    if (!user_found) {
      return null;
    }
    if (relation_profile.length === 0) {
      profile_to_create.first_name = profile.profile.first_name;
      profile_to_create.last_name = profile.profile.last_name;
      profile_to_create.age = profile.profile.age;
      profile_to_create.favorites = profile.profile.favorites;
      const newProfile = await this.User_Profile_Repository.save(
        profile_to_create,
      );
      user_found.profile = newProfile;
      return this.User_Repository.update({ id }, user_found);
    } else {
      const updated_profile = await this.User_Profile_Repository.update(
        { id: relation_profile[0]?.id },
        {
          first_name:
            profile.profile.first_name || relation_profile[0]?.first_name,
          last_name:
            profile.profile.last_name || relation_profile[0]?.last_name,
          age: profile.profile.age || relation_profile[0]?.age,
        },
      );
      return updated_profile;
    }
  }
}
