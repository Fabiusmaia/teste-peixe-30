import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_END_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(express.static(join(__dirname, '..', 'public')));
  const port = process.env.PORT || 3001; 

  await app.listen(port, '0.0.0.0');
}
bootstrap();
