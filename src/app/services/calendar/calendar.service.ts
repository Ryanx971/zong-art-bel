import { Injectable } from '@angular/core';
import { Calendar, CalendarOptions } from '@ionic-native/calendar/ngx';
import { MONTHS, EVENT_LOCATION } from '../../constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export interface Benefit {
  nbVisit: number;
  sum: number;
}

export class CalendarService {
  constructor(private calendar: Calendar) {}

  /**
   * Retourne les bénéfices réalisés
   * @param start Date de début
   * @param end Date de fin
   */
  getMonthBenefits(start: Date, end: Date): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: Benefit = { nbVisit: 0, sum: 0 };

      this.checkCalendar().then(
        (cal: CalendarOptions) => {
          this.calendar.listEventsInRange(start, end).then(
            (data: any) => {
              data.forEach((ev: any) => {
                if (ev.calendar_id === cal.calendarId && ev.eventLocation === EVENT_LOCATION) {
                  result.nbVisit += 1;
                  const split = ev.title.split(',');
                  result.sum += parseInt(split[1], 10);
                }
              });
              resolve(result);
            },
            e => {
              console.error('Erreur, impossible de trouver la liste des évenements [List Events In Range]' + e);
              reject('Erreur, impossible de trouver la liste des évenements');
            },
          );
        },
        e => reject('Erreur, impossible de trouver le calendrier '),
      );
    });
  }

  /**
   * Vérifie si le calendrier est bien activé
   */
  checkCalendar(): Promise<CalendarOptions | string> {
    return new Promise((resolve, reject) => {
      this.calendar.listCalendars().then(
        data => {
          let id = null;
          data.forEach((cal: any) => {
            if (cal.name === 'zongartbel@gmail.com') {
              id = parseInt(cal.id, 10);
            }
          });

          if (!id) {
            // tslint:disable-next-line: quotemark
            reject("Erreur, pas de calendrier 'zongartbel@gmail.com'.");
          }
          const calOptions: CalendarOptions = this.calendar.getCalendarOptions();
          calOptions.calendarId = id;
          resolve(calOptions);
        },
        e => {
          console.error('Erreur, impossible de récupérer la liste des calendriers. [List Calendars]', e);
          reject('Erreur, impossible de récupérer la liste des calendriers.');
        },
      );
    });
  }

  /**
   * Ouvre l'application calendrier du téléphone
   */
  openCalendar(date: Date = null): void {
    if (date === null) {
      date = new Date();
    }
    this.calendar.openCalendar(date);
  }

  /**
   * Retourne le nombre de rendez-vous qu'il reste à faire
   * au cours de la journée
   */
  getRdvOfDay(): Promise<number | string> {
    return new Promise((resolve, reject) => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      let count = 0;
      this.calendar.listEventsInRange(startDate, endDate).then(
        (data: any) => {
          if (data && data.length) {
            data.forEach((ev: any) => {
              if (ev.eventLocation === EVENT_LOCATION) {
                count += 1;
              }
            });
          }
          if (count > 0) {
            resolve(count);
          }
          // tslint:disable-next-line: quotemark
          reject("Pas de rendez-vous aujourd''hui.");
        },
        e => {
          console.error('Erreur, impossible de trouver la liste des évenements [List Events In Range]' + e);
          reject('Erreur, impossible de trouver la liste des évenements.');
        },
      );
    });
  }

  /**
   * Création d'un événement
   * @param title nom de l'événement
   * @param notes  notes
   * @param startDate  date de début
   * @param endDate  date de fin
   * @param frequence  fréquences des rendez-vous
   */
  createEvent(title: string, notes: string, startDate: Date, endDate: Date, frequence: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkCalendar().then(
        (calOptions: CalendarOptions) => {
          if (frequence !== 'aucune') {
            calOptions.recurrence = 'weekly';
            calOptions.recurrenceInterval = +frequence;
          }
          this.calendar
            .createEventWithOptions(title, EVENT_LOCATION, notes + ' €', startDate, endDate, calOptions)
            .then(
              () => resolve(),
              e => {
                console.error('Erreur, impossible de créer un évenement [Create Event With Options]' + e);
                reject('Erreur, impossible de créer un évenement [Create Event With Options]');
              },
            );
        },
        e => console.error('Erreur, impossible de trouver le calendrier ' + e),
      );
    });
  }
}
