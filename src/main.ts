import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptionHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors()
  app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(3007);
}
bootstrap();
