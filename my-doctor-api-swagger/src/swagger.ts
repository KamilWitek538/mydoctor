import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('MyDoctor API')
        .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
        .setDescription('API Documentation')
        .setVersion('1.1')
        .setSchemes("https", "http")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('documentation', app, document);
}
