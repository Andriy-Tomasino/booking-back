import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmartOutletService } from './smart-outlet.service';
import { SmartOutletController } from './smart-outlet.controller';

@Module({
  imports: [ConfigModule],
  providers: [SmartOutletService],
  controllers: [SmartOutletController],
  exports: [SmartOutletService],
})
export class SmartOutletModule {}
