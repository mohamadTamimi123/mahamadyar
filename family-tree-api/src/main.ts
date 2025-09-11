import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS (configurable via CORS_ORIGINS env, comma-separated)
  const corsOriginsEnv = process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://72.60.81.203:3002';
  const allowedOrigins = corsOriginsEnv.split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
