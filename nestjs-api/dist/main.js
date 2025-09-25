"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(require('express').json({ limit: '10mb' }));
    app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
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
    const originSetting = corsOriginsEnv === '*'
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
//# sourceMappingURL=main.js.map