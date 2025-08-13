import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Configure CORS to allow requests from all origins
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: allowedOrigin === '*' ? true : [allowedOrigin],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Use port 80 for Azure Web Apps (guaranteed to work)
  const port = Number(process.env.WEBSITES_PORT || process.env.PORT || 3000);
  console.log(`Starting application on port ${port}`);
  await app.listen(port);
}
bootstrap();
