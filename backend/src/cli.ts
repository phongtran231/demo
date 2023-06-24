import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';
import { connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['debug'],
  });

  try {
    await app.select(CommandModule).get(CommandService).exec();
    connection.close().then(() => {
      setTimeout(() => {
        app.close();
      }, 500);
    });
  } catch (error) {
    console.error(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
