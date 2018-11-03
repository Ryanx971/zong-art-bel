import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';

@Injectable()
export class CalendarProvider {

  calendarId: number = 0;

  constructor(
    private calendar: Calendar,
) {}

  checkCalendar(): Promise<any>
  {
    return new Promise ((resolve, reject) => {
      this.calendar.listCalendars().then(data =>
        {
          var id;
          data.forEach(function(cal)
          {
            if(cal.name == "zongartbel@gmail.com")
            {
              id = parseInt(cal.id);
              resolve(true);
            }
            else
            {
              reject(false);
            }
          });
          this.calendarId = id;
        },
        e=>
        {
          console.log("Error get listCalendars "+e);
        });
    });
  }

  countDayRdv(): Promise<any>
  {
    return new Promise ((resolve, reject) => {
      let startDate = new Date();
      let endDate = new Date();
      endDate.setHours(23,59,59,999);

      var count = 0;
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
          data.forEach(ev=> {
            if(ev.eventLocation == "Zong Art Bel")
            {
              count += 1;
            }
          });
          if(count > 0)
            resolve("Il vous reste "+count+" rendez-vous aujourd'hui");
          else
            reject("");
        },
        error=>{
          console.log("Can\'t get list of rdv of the day");
        });
    });
  }
}
