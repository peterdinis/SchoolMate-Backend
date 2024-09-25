import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get a hello message' })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned hello message.',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
