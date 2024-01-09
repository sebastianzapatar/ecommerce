import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,

    private readonly jwtService:JwtService
  ){}
  async create(createAuthDto: CreateAuthDto) {
    try{
      const user=this.userRepository.create({
        ...createAuthDto,
        password:bcrypt.hashSync(createAuthDto.password,10)
      });
      
      await this.userRepository.save(user);
      const {email,fullName}=user;
      const jwt=this.getJwtToken({email});
      return {email,fullName,jwt};
    }
    catch(e){
      console.log(e);
      throw new BadRequestException(e.detail);
    }
    
  }
  private getJwtToken(payload:JwtPayload){
    
    const  token=this.jwtService.sign(payload);
    return token;
  }
  async login(loginUser:LoginAuthDto){
    try{
      const {email,password}=loginUser;
      const user=await this.userRepository.findOneBy({email});
      if(!user) throw new UnauthorizedException('User or password incorrect');
      const isValid=bcrypt.compareSync(password, user.password);

      if(!isValid) throw new UnauthorizedException('User or password incorrect');
      const jwt=this.getJwtToken({email});
      return {email,jwt};
    }
    catch(e){
      throw new UnauthorizedException('User or password incorrect');
    }
  }
  
}
