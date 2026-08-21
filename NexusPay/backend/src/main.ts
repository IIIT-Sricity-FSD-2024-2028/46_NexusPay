import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,x-user-role,x-user-email,x-password',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('NexusPay API')
    .setDescription(
      'RESTful API for NexusPay — Digital Payments and Transaction Coordination Platform.\n\n' +
        '**Role-Based Access Control**: Pass the user role via the `x-user-role` header.\n' +
        'Valid roles: `customer`, `merchant`, `admin`, `superuser`.\n\n' +
        '**User Context**: Pass the user email via the `x-user-email` header for user-scoped endpoints.',
    )
    .setVersion('1.0')
    .addGlobalParameters(
      {
        name: 'x-user-role',
        in: 'header' as const,
        required: false,
        description: 'User role: customer | merchant | admin | superuser',
        schema: { type: 'string' },
      },
      {
        name: 'x-user-email',
        in: 'header' as const,
        required: false,
        description: 'User email for scoped requests',
        schema: { type: 'string' },
      },
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log('🚀 NexusPay API running on http://localhost:3000');
  console.log('📖 Swagger docs at http://localhost:3000/api/docs');
}

bootstrap().catch(console.error);
