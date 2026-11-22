import { Body, Controller, Get, Post } from '@nestjs/common';
import { validateSession } from './booking-rules';

@Controller('v1')
export class ApiController {
  @Get('health')
  health() {
    return { ok: true, product: 'Academia OS', mode: 'demo', version: '0.1.0' };
  }

  @Get('catalog')
  catalog() {
    return {
      demo: true,
      workspaceKinds: ['SOLO', 'ACADEMY'],
      sessionModes: ['ONLINE', 'ONSITE', 'HYBRID'],
      subjects: ['Matemáticas', 'Física', 'Programación', 'Inglés'],
      meetingProviders: ['MEET', 'ZOOM', 'CUSTOM'],
      storageProviders: ['GOOGLE_DRIVE', 'UPLOAD', 'EXTERNAL_LINK'],
    };
  }

  @Post('bookings/validate')
  validate(@Body() body: unknown) {
    return validateSession(body);
  }
}
