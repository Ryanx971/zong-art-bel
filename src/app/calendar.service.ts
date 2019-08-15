/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-14T16:38:54+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T15:16:38+02:00
 */



import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  EVENT_LOCATION: string = "Zong Art Bel";

  constructor(private calendar: Calendar) {}

  getMonthBenefits(start, end): Promise<any> {
    return new Promise ((resolve, reject) => {
      let nbRdv = 0;
      let argent = 0;

      this.checkCalendar().then((cal) => {
        this.calendar.listEventsInRange(start, end).then(data => {
          data.forEach(ev => {
            if(ev.calendar_id == cal.calendarId && ev.eventLocation == this.EVENT_LOCATION) {
              nbRdv += 1;
              let split = ev.title.split(",");
              argent += parseInt(split[1]);
            }
          });
          let res = { nbRdv: nbRdv, argent: argent, have: true};
          if(nbRdv === 0)
            res.have = false;
          resolve(res);
       },
       e => {
         reject("Can\'t get list of rdv " + e);
       });
     }, e => reject("Error check calendar " + e));
    });
  }

  checkCalendar(): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.calendar.listCalendars().then(data => {
          let id = null;
          data.forEach(cal => {
            if(cal.name == "zongartbel@gmail.com")
              id = parseInt(cal.id)
          });
          if(!id)
            reject("Error, No calendar 'zongartbel@gmail.com'.")
          let calOptions = this.calendar.getCalendarOptions();
          calOptions.calendarId = id;
          resolve(calOptions);
        },
        e=>
        {
          console.error("Error get list of calendars ", e);
        });
    });
  }

  openCalendar(date:Date = null): void {
    if(date === null)
      date = new Date();
    this.calendar.openCalendar(date);
  }

  getRdvOfDay(): Promise<any> {
    return new Promise ((resolve, reject) => {
      let startDate = new Date();
      let endDate = new Date();
      endDate.setHours(23,59,59,999);

      let count = 0;
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
          if(data && data.length) {
            data.forEach(ev => {
              if(ev.eventLocation === this.EVENT_LOCATION)
              count += 1;
            });
          }
          if(count > 0) {
            resolve(count);
          }
          else {
            reject("No rdv today");
          }
        },
        e =>{
          console.error("Can\'t get list of rdv of the day" + e);
          reject("Can\'t get list of rdv of the day");
        });
    });
  }

  createEvent(title:string, notes:string, startDate:Date, endDate:Date, frequence: string): Promise<any> {
      return new Promise ((resolve, reject) => {
        this.checkCalendar().then(calOptions => {
          if(frequence != "aucune") {
            calOptions.recurrence = "weekly";
            calOptions.recurrenceInterval = +frequence;
          }
          this.calendar.createEventWithOptions(title, this.EVENT_LOCATION, notes +" €", startDate, endDate, calOptions).then(() => resolve(), (e)=> reject(e));
        }, e => console.error(e));
      });
  }
}
