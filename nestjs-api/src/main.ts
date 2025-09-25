import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Increase payload size limit for image uploads
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
  
  // Enable CORS (configurable via CORS_ORIGINS, comma-separated)
  const corsOriginsEnv = (process.env.CORS_ORIGINS || '').trim();
  const defaultOrigins = [
    'http://72.60.81.203:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
  ];
  const extraOrigins = corsOriginsEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const origins = Array.from(new Set([...defaultOrigins, ...extraOrigins]));

  const originSetting: any = corsOriginsEnv === '*'
    ? true
    : origins;

  app.enableCors({
    origin: originSetting,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'content-type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
