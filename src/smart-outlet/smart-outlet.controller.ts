import { Controller, Get, Post, Param } from '@nestjs/common';
import { SmartOutletService } from './smart-outlet.service';
import { SmartOutlet } from './interfaces/smart-outlet.interface';
//import { JwtAuthGuard } from 'auth/jwt-auth.guard';

@Controller('smart-outlet')
//@UseGuards(JwtAuthGuard)
export class SmartOutletController {
  constructor(private readonly smartOutletService: SmartOutletService) {}

  @Get(':outletId/status')
  async getOutletStatus(@Param('outletId') outletId: string):Promise<SmartOutlet> {
    return this.smartOutletService.getOutletStatus(outletId);
  }
  @Post(':outletId/toggle')
  async toggleOutlet(@Param('outletId') outletId: string):Promise<SmartOutlet> {
    return this.smartOutletService.toggleOutlet(outletId);
  }
}
