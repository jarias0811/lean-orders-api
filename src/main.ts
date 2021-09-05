import { config } from 'dotenv';
config();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const { ENABLE_SWAGGER, APP_PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  if (ENABLE_SWAGGER === 'true') {
    const options = new DocumentBuilder()
      .setTitle('Lean Orders API')
      .setDescription('API to control the buy/sale order for products stock')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(Number(APP_PORT));
}

bootstrap();
