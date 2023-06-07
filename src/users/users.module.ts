import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users_Table } from './users.entity';
import { Profile } from './profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users_Table, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
