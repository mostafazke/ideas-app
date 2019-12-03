import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './shared/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

dotenv.config();
const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(port);
  Logger.log(`Server running on port ${port}`, 'bootstrap', true);
}
bootstrap();
