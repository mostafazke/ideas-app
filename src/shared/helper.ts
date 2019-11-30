import { Logger } from '@nestjs/common';

export class Helper {
  private static instance: Helper;
  private constructor() {}

  public static getInstance(): Helper {
    if (!Helper.instance) {
      Helper.instance = new Helper();
    }

    return Helper.instance;
  }

  logData(...data: any[]) {
    data.forEach(d => {
      Logger.log(JSON.stringify(d));
    });
  }
}
