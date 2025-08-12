// Root entry point for Azure deployment
// This file routes Azure to the backend folder

// Import the built NestJS application
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./backend/dist/app.module');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Configure CORS to allow requests from all origins
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: false, // Must be false when origin is '*'
    });

    // Use port 3000 for local development, port 80 for Azure
    const port = process.env.NODE_ENV === 'production' 
      ? (process.env.WEBSITES_PORT || process.env.PORT || 80)
      : 3000;
    console.log(`Starting application on port ${port}`);
    await app.listen(port);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
