import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const config = new DocumentBuilder().setTitle('Queuety API Docs').setVersion('1.0').addTag('queuety').build();
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: ['http://localhost:5173', 'http://192.168.0.226:5173'] });
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.listen(3334);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  new Logger('Queuety').log(`Docs: ${await app.getUrl()}/docs`, `Docs (local):  http://localhost:3334/docs`);
}
bootstrap();
