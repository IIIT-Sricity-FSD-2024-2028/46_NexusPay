"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api', {
        exclude: ['/'],
    });
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Accept,x-user-role,x-user-email,x-password',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NexusPay API')
        .setDescription('RESTful API for NexusPay — Digital Payments and Transaction Coordination Platform.\n\n' +
        '**Role-Based Access Control**: Pass the user role via the `x-user-role` header.\n' +
        'Valid roles: `customer`, `merchant`, `admin`, `superuser`.\n\n' +
        '**User Context**: Pass the user email via the `x-user-email` header for user-scoped endpoints.')
        .setVersion('1.0')
        .addGlobalParameters({
        name: 'x-user-role',
        in: 'header',
        required: false,
        description: 'User role: customer | merchant | admin | superuser',
        schema: { type: 'string' },
    }, {
        name: 'x-user-email',
        in: 'header',
        required: false,
        description: 'User email for scoped requests',
        schema: { type: 'string' },
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3000);
    console.log('🚀 NexusPay API running on http://localhost:3000');
    console.log('📖 Swagger docs at http://localhost:3000/api/docs');
}
bootstrap().catch(console.error);
//# sourceMappingURL=main.js.map