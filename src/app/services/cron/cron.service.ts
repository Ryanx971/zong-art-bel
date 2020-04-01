import { Injectable } from '@angular/core';
import { CronJob } from 'cron';

@Injectable({
  providedIn: 'root',
})
export class CronService {
  private job: CronJob = null;

  constructor() {}

  runMsgCron = (): void => {
    console.log('Cron', this.job);
    this.job = new CronJob('* * * * * *', this.doCron);
    this.job.start();
  };

  private doCron = (): void => {
    console.log('Cron !');
  };

  stopCron = (): void => {
    this.job.stop();
  };
}
