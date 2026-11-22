import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: ['http://localhost:5173'], credentials: false });
  await app.listen(Number(process.env.PORT || 3001));
}
bootstrap().catch((error: unknown) => {
  console.error('Unable to start API', error);
  process.exitCode = 1;
});
