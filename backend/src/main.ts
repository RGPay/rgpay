import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('RGPay API')
    .setDescription('API documentation for RGPay payment management system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use port 80 for Azure Web Apps (guaranteed to work)
  const port = Number(process.env.WEBSITES_PORT || process.env.PORT || 3000);
  console.log(`Starting application on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api`,
  );
  await app.listen(port, '0.0.0.0');
}
bootstrap();
