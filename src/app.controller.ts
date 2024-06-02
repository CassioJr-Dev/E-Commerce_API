import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello Word')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: 'Hello World',
    },
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
