import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("")
  async homeRoute(): Promise<any> {
    return {
      success: true,
      status: HttpStatus.FOUND,
      data: {}
    }
  }

}
