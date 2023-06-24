import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommandModule } from 'nestjs-command';
import configuration from './common/configuration';
import mongoose from 'mongoose';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017', {
      dbName: 'demo',
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    CommandModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
mongoose.set('debug', true);
