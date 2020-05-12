import { Injectable } from '@angular/core';
import { CronJob, CronTime } from 'cron';
import { CalendarService } from '../calendar/calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from 'src/app/models/Customer';
import {
  STORAGE_CUSTOMERS,
  STORAGE_MESSAGE_TIME,
  STORAGE_MESSAGE_ENABLED,
  STORAGE_MESSAGE_TEXT,
  STORAGE_CRON,
} from 'src/app/constants/app.constant';
import { ToastService } from '../toast/toast.service';
import { SmsService } from '../sms/sms.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { CalendarOptions } from '@ionic-native/calendar/ngx';

@Injectable({
  providedIn: 'root',
})
export class CronService {
  private job: CronJob | undefined = undefined;

  constructor(
    private calendarService: CalendarService,
    private nativeStorage: NativeStorage,
    private toastService: ToastService,
    private smsService: SmsService,
    private localNotifications: LocalNotifications,
  ) {
    // console.log('Construct');
    // this.nativeStorage.getItem(STORAGE_CRON).then((cron: CronJob | undefined) => {
    //   console.log('Cron', cron);
    //   this.job = cron;
    // });
  }

  runMsgCron = (): void => {
    if (this.job === undefined) {
      this.calendarService.checkCalendar().then(
        (data: CalendarOptions) => {
          let messageTime: string = '30 10 * * *';
          this.nativeStorage
            .getItem(STORAGE_MESSAGE_TIME)
            .then((data: string) => {
              const timeSplit: string[] = data.split(':');
              const hour = timeSplit[0].trim();
              const minute = timeSplit[1].trim();
              messageTime = minute + ' ' + hour + ' * * *';
            })
            .catch((e: any) => {
              console.error('Error in getItem', e);
            })
            .finally(() => {
              // Toutes les jours a 10h30
              this.job = new CronJob(messageTime, this.doCron);
              // Every minute
              // this.job = new CronJob('* * * * *', this.doCron);
              // Every second
              // this.job = new CronJob('* * * * * *', this.doCron);
              this.job.start();
            });
        },
        (e: string) => console.error(e),
      );
    }
  };

  toogleCron = (enabled: boolean): void => {
    if (enabled) {
      this.job.start();
    } else {
      this.job.stop();
    }
  };

  setTime = (time: string): void => {
    const timeSplit: string[] = time.split(':');
    const hour = timeSplit[0].trim();
    const minute = timeSplit[1].trim();
    const cronTime: CronTime = new CronTime(minute + ' ' + hour + ' * * *');

    this.job.setTime(cronTime);

    this.nativeStorage.getItem(STORAGE_MESSAGE_ENABLED).then(
      (data: boolean) => {
        if (data) {
          this.job.start();
        }
      },
      (e: any) => {
        console.error('Error in getItem', e);
      },
    );
  };

  private doCron = (): void => {
    this.nativeStorage.getItem(STORAGE_MESSAGE_ENABLED).then(
      (data: boolean) => {
        if (data) {
          run();
        }
      },
      (e: any) => {
        console.error('Error in getItem', e);
      },
    );

    const run = () => {
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
                  events.forEach((a: any) => {
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
                  });
                  if (events.length) this.showEndNotification(customersErrors, events.length);
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
    let endText: string = '';
    this.nativeStorage.getItem(STORAGE_MESSAGE_TEXT).then(
      (data: string) => {
        endText = '\n' + data;
      },
      (e: any) => {
        console.error('Error in getItem', e);
      },
    );
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const minute = startDate.getMinutes() !== 0 ? startDate.getMinutes() : '';
    const startHour = startDate.getHours() + 'h' + minute;
    let messageText: string =
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
      "\nPar mesure de sécurité je ne pourrais pas recevoir d'accompagnateur 😔" +
      '\nMerci de venir avec son masque OBLIGATOIREMENT 😷' +
      "\nPrivilégiez le paiement par CB 💳 ou le cas échéant faire l'appoint de monnaie💶." +
      '\n\n⚠️Merci de confirmer⚠️' +
      "\n\n🤗Zong' Art Bel💅🏾";
    return messageText;
  };

  private showEndNotification = (contactsError: string[], nbEvents: number): void => {
    const NOTIFICATION_ID: number = 1;
    const nbErrors: number = contactsError.length ? contactsError.length : 0;
    const nbSuccess: number = nbEvents - nbErrors;
    let message: string = nbSuccess + ' ' + (nbSuccess > 1 ? 'messages' : 'message') + ' sur ' + nbEvents;
    if (contactsError.length) {
      message += "\nEchec de l'envoi ";
      contactsError.length > 1 ? (message += 'aux clientes suivantes :\n') : (message += 'à la cliente suivante :\n');
      contactsError.forEach((displayName: string) => {
        message += '- ' + displayName + '\n';
      });
    }
    this.localNotifications.schedule({
      id: NOTIFICATION_ID,
      title: 'Envoi des messages',
      text: message,
      progressBar: { value: (nbSuccess * 100) / nbEvents },
    });
  };
}
