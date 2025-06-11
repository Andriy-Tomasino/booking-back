import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ewelink } from 'ewelink-api';
import { SmartOutlet } from './interfaces/smart-outlet.interface';

@Injectable()
export class SmartOutletService {
  private readonly logger = new Logger(SmartOutletService.name);
  private readonly connection: any;

  constructor(private readonly configService: ConfigService) {
      const email = this.configService.get<string>('EWELINK_EMAIL');
      const password = this.configService.get<string>('EWELINK_PASSWORD');
      const region = this.configService.get<string>('EWELINK_REGION', 'eu');

    if (!email) {
      throw new Error('EWELINK_EMAIL is not defined in .env');
    }
    if (!password) {
      throw new Error('EWELINK_PASSWORD is not defined in .env');
    }

      this.connection = new ewelink({email, password, region,});
  }

  async getOutletStatus(outletId:string): Promise<SmartOutlet> {
    try {
      const device = await this.connection.getDevices(outletId);
      const isPoweredOn = device?.params?.switch == 'on';
      this.logger.log(`Fetched status from outlet ${outletId}: ${isPoweredOn}`);
      return {isPoweredOn};
    } catch (error) {
      this.logger.error(`Failed to fetch status for outlet ${outletId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isPoweredOn: false };
    }
  }

  async toggleOutlet(outletId: string): Promise<SmartOutlet> {
    try {
      const response = await this.connection.toggleDevice(outletId);
      const isPoweredOn = response?.params?.switch == 'on';
      this.logger.log(`Toggle outlet ${outletId} to ${isPoweredOn ? 'on' : 'off'}`);
      return { isPoweredOn };
    } catch (error) {
      this.logger.error(`Failed to toggle outlet ${outletId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Failed to toggle outlet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}