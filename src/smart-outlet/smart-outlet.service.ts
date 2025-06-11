// app.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ewelink from 'ewelink-api';

@Injectable()
export class AppService {
  private connection: any;

  constructor(private readonly configService: ConfigService) {
    this.connection = new ewelink({
      email: this.configService.get<string>('EWELINK_EMAIL'),
      password: this.configService.get<string>('EWELINK_PASSWORD'),
      region: this.configService.get<string>('EWELINK_REGION', 'us'),
    });
  }

  async getDevices(): Promise<any> {
    try {
      const devices = await this.connection.getDevices();
      return devices;
    } catch (error) {
      throw new Error(`Failed to fetch devices: ${error.message}`);
    }
  }

  async toggleDevice(deviceId: string): Promise<any> {
    try {
      const response = await this.connection.toggleDevice(deviceId);
      return response;
    } catch (error) {
      throw new Error(`Failed to toggle device: ${error.message}`);
    }
  }
}