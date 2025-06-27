declare module 'ewelink-api' {
  export interface EWeLinkOptions {
    email: string;
    password: string;
    region?: string;
  }
  export default class ewelink {
    constructor(options: EWeLinkOptions);
    getDevice(deviceId: string): Promise<any>;
    toggleDevice(deviceId: string): Promise<any>;
  }
}
