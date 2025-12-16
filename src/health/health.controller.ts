import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private dataSource: DataSource) {}

  @Get()
  async checkHealth() {
    try {
      // Intenta hacer una query simple para verificar conexión
      await this.dataSource.query('SELECT 1');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        message: '✅ Base de datos conectada correctamente'
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        message: '❌ No se pudo conectar a la base de datos',
        error: error.message
      };
    }
  }
}
