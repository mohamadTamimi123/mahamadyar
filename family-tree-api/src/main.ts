import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS using environment variables
  // CORS_ORIGINS: comma-separated list, e.g. "http://localhost:3002,http://127.0.0.1:3002"
  // CORS_METHODS: comma-separated list, default: GET,POST,PUT,DELETE,PATCH,OPTIONS
  // CORS_HEADERS: comma-separated list, default: Content-Type,Authorization
  // CORS_CREDENTIALS: 'true' or 'false'
  const envList = (value?: string, fallback: string[] = []) =>
    (value ?? '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
      .concat((!value || value.trim() === '') ? fallback : []);

  const corsOrigins = envList(process.env.CORS_ORIGINS, [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://72.60.81.203:3002'
  ]);
  const corsMethods = envList(process.env.CORS_METHODS, ['GET','POST','PUT','DELETE','PATCH','OPTIONS']);
  const corsHeaders = envList(process.env.CORS_HEADERS, ['Content-Type','Authorization']);
  const corsCredentials = (process.env.CORS_CREDENTIALS ?? 'true').toLowerCase() === 'true';

  app.enableCors({
    origin: corsOrigins,
    methods: corsMethods,
    allowedHeaders: corsHeaders,
    credentials: corsCredentials,
  });
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
