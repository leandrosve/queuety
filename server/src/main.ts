import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Queuety API Docs')
    .setVersion('1.0')
    .addTag('queuety')
    .build();
  app.enableCors();
  app.setGlobalPrefix('/api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3334);
}
bootstrap();
