import { Injectable } from '@angular/core';
import { CronJob } from 'cron';
import { CalendarService } from '../calendar/calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Appointement } from 'src/app/models/Appointment';
import { Customer } from 'src/app/models/Customer';
import { STORAGE_CUSTOMERS } from 'src/app/constants/app.constant';
import { ToastService } from '../toast/toast.service';
import { SmsService } from '../sms/sms.service';

@Injectable({
  providedIn: 'root',
})
export class CronService {
  private job: CronJob = null;

  constructor(
    private calendarService: CalendarService,
    private nativeStorage: NativeStorage,
    private toastService: ToastService,
    private smsService: SmsService,
  ) {}

  runMsgCron = (): void => {
    if (!this.job) {
      this.calendarService.checkCalendar().then(() => {
        // Toutes les jours a 11h30
        this.job = new CronJob('30 11 * * *', this.doCron);
        this.job.start();
      });
    }
  };

  private doCron = (): void => {
    let customers: Customer[] = [];
    this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
      (data: Customer[]) => {
        customers = data;
        this.calendarService.checkCalendar().then(
          () => {
            // Date d'aujourd'hui à minuit
            const startDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
            const endDate: Date = new Date(new Date().setHours(24, 0, 0, 0));
            this.calendarService.getEventsByDate(startDate, endDate).then(
              (events: any[]) => {
                events.forEach((a: any) => {
                  const titleSplit: string[] = a.title.split('|•|');
                  const service: string = titleSplit[1].trim();
                  const price: number = parseInt(titleSplit[2].trim(), 10);
                  const id: string = titleSplit[3].trim();
                  const startDate: Date = new Date(a.dtstart);
                  // On récupère le contact (pour récupérer son numéro de téléphone)
                  const contact: Customer | null = this.getContact(customers, id);
                  if (contact) {
                    this.smsService.sendMessage(
                      contact.phoneNumbers[0].value,
                      this.generateMessage(startDate, service),
                    );
                  }
                });
              },
              (e) => this.showErrorToast(),
            );
          },
          (e) => this.showErrorToast(),
        );
      },
      (e) => {
        this.showErrorToast();
        console.error('Error in getItem', e);
      },
    );
  };

  stopCron = (): void => {
    this.job.stop();
  };

  // HELPER
  private showErrorToast = (): void => {
    console.error('Error in cron');
    this.toastService.show("Impossible d'envoyer les messages aux clients", 'danger-toast', 'bottom', 4000);
  };

  private getContact = (customersList: Customer[], id: string): Customer | null => {
    let result: Customer | null = null;
    customersList.forEach((c: Customer) => {
      if (c.rawId === id) result = c;
    });
    return result;
  };

  private generateMessage = (startDate: Date, service: string): string => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const minute = startDate.getMinutes() !== 0 ? startDate.getMinutes() : '';
    const startHour = startDate.getHours() + 'h' + minute;
    return (
      'Bonjour ' +
      ',\nVotre prochain rendez-vous est le ' +
      startDate.toLocaleString('fr-FR', options) +
      ' à ' +
      startHour +
      '.\nPour un/une ' +
      service +
      '\n À demain \nZong Art Bel'
    );
  };
}
