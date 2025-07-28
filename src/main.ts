import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Computer booking')
    .setDescription('API for booking computers')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: ['http://localhost:8081', 'http://localhost:19006'],
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
