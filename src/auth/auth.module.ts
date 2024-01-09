import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[TypeOrmModule.forFeature([User]),
  PassportModule.register({defaultStrategy:'jwt'}),
  JwtModule.registerAsync({//Porque se tiene que esperar que se cargue todo en la app
    imports:[],
    inject:[],
    useFactory:()=>{
      console.log(process.env.SECRET_PASSWORD);
      return {
        secret:process.env.SECRET_PASSWORD,
        signOptions:{
          expiresIn:'2h'
        }
      }
    }
  })
  ],
  exports:[TypeOrmModule,JwtStrategy,PassportModule,JwtModule],
})
export class AuthModule {}

