import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Expenso NestJS backend running on http://localhost:${port}`);
}

bootstrap();
