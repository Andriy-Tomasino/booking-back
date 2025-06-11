declare module 'ewelink-api' {
  export interface EWeLinkOptions {
    email: string;
    password: string;
    region?: string;
  }
  export class ewelink {
    constructor(options: EWeLinkOptions);
    getDevice(deviceId: string): Promise<any>;
    toggleDevice(deviceId: string): Promise<any>;
  }
}
