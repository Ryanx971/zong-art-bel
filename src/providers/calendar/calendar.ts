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


  getNews(start:number = 0, range:number = 6): Promise<any> {
    return new Promise ((resolve, reject) => {
      let options = {
        api_key: IMAIRIE_API_KEY,
        page: 'api',
        json: 'actus',
        start: start.toString(),
        range: range.toString()
      }
      this.http.get(IMAIRIE_URL, options, {}).then(res => {
        let data = JSON.parse(res.data);
				resolve(data);
      }, e => reject(e));
    });
  }
}
