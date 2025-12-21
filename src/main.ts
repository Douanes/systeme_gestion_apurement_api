import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Système de Gestion d\'Apurement API')
    .setDescription(
      'API REST pour le système de gestion d\'apurement des douanes. ' +
      'Cette API permet de gérer les déclarations, ordres de mission, agents, ' +
      'bureaux de sortie, maisons de transit et autres entités liées au processus d\'apurement.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000', 'Serveur de développement')
    .addServer('https://api-apurement.ameenaltech.com', 'Serveur de production')
    .setContact(
      'Support Technique',
      'https://ameenaltech.com',
      'support@ameenaltech.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI setup
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  // Serve OpenAPI JSON
  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.json(document);
  });

  // ReDoc setup - serve static HTML with ReDoc
  const redocHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Système de Gestion d'Apurement - API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc 
          spec-url='/api/docs-json'
          hide-download-button
          theme='{ 
            "colors": { 
              "primary": { 
                "main": "#1976d2" 
              } 
            },
            "typography": {
              "fontSize": "14px",
              "fontFamily": "Roboto, sans-serif"
            }
          }'
        ></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
      </body>
    </html>
  `;

  app.getHttpAdapter().get('/api/redoc', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(redocHtml);
  });

  // Redirect root path to ReDoc
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api/redoc');
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction
    ? 'https://api-apurement.ameenaltech.com'
    : `http://localhost:${port}`;

  console.log(`\n🚀 Application is running on: ${baseUrl}`);
  console.log(`📚 Swagger UI: ${baseUrl}/api/docs`);
  console.log(`📖 ReDoc: ${baseUrl}/api/redoc`);
  console.log(`📄 OpenAPI JSON: ${baseUrl}/api/docs-json`);
  console.log(`🔗 Root (/) redirects to ReDoc\n`);
}

bootstrap();