import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  const options = new DocumentBuilder()
  .setTitle('Community platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, options, {});
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  console.log("hihi: "+process.env.FIREBASE_ADMIN_SDK_JSON);
  
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
