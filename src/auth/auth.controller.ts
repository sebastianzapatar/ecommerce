import { Controller, Get, Post, Body, Req, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from './decorators/getuser.decorator';
import { User } from './entities/users.entity';
import { UseRoleGuardGuard } from './guards/use-role-guard/use-role-guard.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('login')
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @Get("private")
  @UseGuards(AuthGuard())
  mundo(@getUser() user:User){
    console.log(user);
    return {email:user.email,fullName:user.fullName};
  }
  @Get("private2")
  @UseGuards(AuthGuard(),UseRoleGuardGuard)
  prueba2(@getUser() user:User){
    return user;
  }
}
