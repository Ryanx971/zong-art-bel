import { Injectable } from '@angular/core';
import { CronJob } from 'cron';
import { CalendarService } from '../calendar/calendar.service';
import { start } from 'repl';
import { Appointement } from 'src/app/models/Appointment';

@Injectable({
  providedIn: 'root',
})
export class CronService {
  private job: CronJob = null;

  constructor(private calendarService: CalendarService) {}

  runMsgCron = (): void => {
    if (!this.job) {
      this.calendarService.checkCalendar().then(() => {
        // Toutes les secondes
        // this.job = new CronJob('* * * * * *', this.doCron);
        // this.job.start();
      });
    }
  };

  private doCron = (): void => {
    this.calendarService.checkCalendar().then(() => {
      // Date d'aujourd'hui à minuit
      const startDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
      const endDate: Date = new Date(new Date().setHours(24, 0, 0, 0));
      this.calendarService.getEventsByDate(startDate, endDate).then((events: Appointement[]) => {
        console.log(events);
      });
    });
    // Pas de calendrier => Notification
  };

  stopCron = (): void => {
    this.job.stop();
  };
}
