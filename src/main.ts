import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`✅ Expenso NestJS backend running on http://localhost:${port}`);
  console.log(`📊 API: http://localhost:${port}/api`);
  console.log(`💚 Health check: http://localhost:${port}/health`);
}

bootstrap().catch(err => {
  console.error('❌ Error starting application:', err);
  process.exit(1);
});
