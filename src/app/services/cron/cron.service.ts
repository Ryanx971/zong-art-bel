import { Injectable } from '@angular/core';
import { CronJob } from 'cron';
import { CalendarService } from '../calendar/calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from 'src/app/models/Customer';
import { STORAGE_CUSTOMERS } from 'src/app/constants/app.constant';
import { ToastService } from '../toast/toast.service';
import { SmsService } from '../sms/sms.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { environment } from 'src/environments/environment';

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
    private localNotifications: LocalNotifications,
  ) {}

  runMsgCron = (): void => {
    if (!this.job) {
      this.calendarService.checkCalendar().then(() => {
        // Toutes les jours a 10h30
        // this.job = new CronJob('30 10 * * *', this.doCron);
        // Every minute
        this.job = new CronJob('* * * * *', this.doCron);
        // Every second
        // this.job = new CronJob('* * * * * *', this.doCron);
        this.job.start();
      });
    }
  };

  stopCron = (): void => {
    this.job.stop();
  };

  private doCron = (): void => {
    const NOTIFICATION_ID: number = 1;
    let customers: Customer[] = [];
    let customersErrors: string[] = [];
    this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
      (data: Customer[]) => {
        customers = data;
        this.calendarService.checkCalendar().then(
          () => {
            const dateRef = new Date(new Date().setDate(new Date().getDate() + 3));
            const startDate = new Date(dateRef.setHours(0, 0, 0, 0));
            const endDate: Date = new Date(dateRef.setHours(24, 0, 0, 0));
            this.calendarService.getEventsByDate(startDate, endDate).then(
              (events: any[]) => {
                if (events.length) {
                  // NOTIFICATION !
                  this.localNotifications.schedule({
                    id: NOTIFICATION_ID,
                    title: 'Envoi des messages',
                    // text: '0 message sur ' + events.length,
                    // progressBar: { value: 0 },
                  });
                }
                setTimeout(() => {
                  events.forEach((a: any, index: number) => {
                    const titleSplit: string[] = a.title.split('|•|');
                    const displayName: string = titleSplit[0].trim();
                    const service: string = titleSplit[1].trim();
                    const price: number = parseInt(titleSplit[2].trim(), 10);
                    const id: string = titleSplit[3].trim();
                    const startDate: Date = new Date(a.dtstart);
                    // On récupère le contact (pour récupérer son numéro de téléphone)
                    const contact: Customer | null = this.getContact(customers, id);

                    // PROD MODE
                    if (contact) {
                      this.smsService
                        .sendMessage(contact.phoneNumbers[0].value, this.generateMessage(startDate, service, price))
                        .catch(() => {
                          customersErrors.push(displayName);
                        });
                    } else {
                      // Le contact n'a pas été trouvé
                      customersErrors.push(displayName);
                    }

                    // DEV MODE
                    // if (contact && contact.rawId === '2241') {
                    //   this.smsService
                    //     .sendMessage(contact.phoneNumbers[0].value, this.generateMessage(startDate, service, price))
                    //     .catch(() => {
                    //       customersErrors.push(displayName);
                    //     });
                    // }

                    // NOTIFICATION
                    let text: string = index + 1 + ' ' + (index > 0 ? 'messages' : 'message') + ' sur ' + events.length;
                    let progress: number = this.getProgressValue(index + 1, events.length);
                    this.localNotifications.update({
                      id: NOTIFICATION_ID,
                      text: text,
                      progressBar: { value: progress },
                    });
                  });
                  // En cas d'echec de l'environment, affichage de la notification
                  if (customersErrors.length) this.showErrorNotification(customersErrors);
                }, 500);
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

  private generateMessage = (startDate: Date, service: string, price: number): string => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const minute = startDate.getMinutes() !== 0 ? startDate.getMinutes() : '';
    const startHour = startDate.getHours() + 'h' + minute;
    return (
      'Bonjour,' +
      '\nVotre prochain rendez-vous est le ' +
      startDate.toLocaleString('fr-FR', options) +
      ' à ' +
      startHour +
      '.\nPour un/une ' +
      service +
      ' au tarif de ' +
      price +
      '€.' +
      "\nPar mesure de sécurité je ne pourrais pas recevoir d'accompagnateur 😔\nMerci de venir avec son masque 😷\nPrivilégiez le paiement par CB 💳 ou le cas échéant faire l'appoint de monnaie 💶.\n\nMerci de confirmer.\n\n🤗 A bientôt 💅 Zong' Art Bel"
    );
  };

  private showErrorNotification = (contacts: string[]): void => {
    let message: string = "Impossible d'envoyer le message ";
    contacts.length > 1 ? (message += 'aux clientes suivantes :\n') : (message += 'à la cliente suivante :\n');
    contacts.forEach((displayName: string) => {
      message += '- ' + displayName + '\n';
    });
    this.localNotifications.schedule({
      title: "Echec de l'envoi",
      text: message,
    });
  };

  private getProgressValue = (currentValue: number, maxValue: number): number => {
    return (currentValue * 100) / maxValue;
  };
}
