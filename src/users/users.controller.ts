import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { create_user_DTO } from './DTO/create_user.dto';
import { Users_Table } from './users.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { create_profile_DTO } from './DTO/profile_user.dto';
import { ProfileEnum, ReqFavorites } from './DTO/response_profile.dto';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(
    @Body() newUser: create_user_DTO,
  ): Promise<
    HttpException | { message: string; status: number; data: Users_Table }
  > {
    return this.usersService.createUser(newUser);
  }

  @Post(':id/favorites')
  addFavorites(
    @Param('id', ParseIntPipe) id: number,
    @Body() favorites: ReqFavorites,
  ): Promise<{ status: number; data: UpdateResult }> {
    return this.usersService.addFavorites(id, favorites);
  }

  @Get()
  getUsers(): Promise<Users_Table[]> {
    return this.usersService.getUsers();
  }

  @Post('/findone')
  getOneUserPublic(
    @Body()
    req: number,
  ): Promise<Users_Table[] | HttpException> {
    return this.usersService.getOneUserPublic(req);
  }

  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResult> | HttpException {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/profile')
  addProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: ProfileEnum,
  ): Promise<Users_Table | HttpException | UpdateResult> {
    return this.usersService.addProfile(id, profile);
  }
}
