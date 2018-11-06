import { Injectable } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';

@Injectable()
export class CalendarProvider {

  calendarId: number = 0;
  tabMois: Array<string> = [
   "janvier", "fevrier", "mars",
   "avril", "mai", "juin", "juillet",
   "août", "septembre", "octobre",
   "novembre", "decembre"
  ];

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
              resolve();
            }
            else
            {
              reject();
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

  graphValue(): Promise<any>
  {
      return new Promise ((resolve, reject) =>
      {
        var arrayValue = [];
        var initialDate = new Date();
        var endDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0);
        // Les 2 derniers mois
        for (var i = 2; i > 0; i--)
        {
          var dateDebutPrevious= new Date(initialDate.getFullYear(),initialDate.getMonth()-i,1);
          var dateFinPrevious = new Date(dateDebutPrevious.getFullYear(), dateDebutPrevious.getMonth() + 1, 0);
          this.getMonthMoney(dateDebutPrevious,dateFinPrevious).then(res =>
            {
              arrayValue.push(res["argent"]);
            },
            e =>
            {
              reject("2 Derniers mois: "+e);
            });
        }

        // Mois actuel
        this.getMonthMoney(initialDate,endDate).then(res =>
          {
            arrayValue.push(res["argent"]);
          },
          e =>
          {
            reject("Mois actuel: "+e);
          });

        // 2 Mois suivant
        for (var k = 1; k < 3; k++)
        {
            var dateDebutNext = new Date(initialDate.getFullYear(),initialDate.getMonth()+k,1);
            var dateFinNext = new Date(dateDebutNext.getFullYear(), dateDebutNext.getMonth() + 1, 0);
            this.getMonthMoney(dateDebutNext,dateFinNext).then(res =>
              {
                arrayValue.push(res["argent"]);
              },
              e =>
              {
                reject("2 Derniers mois: "+e);
              });
        }
        resolve(arrayValue);
      });
  }

  getMonthMoney(debut,fin): Promise<any>
  {
    return new Promise ((resolve, reject) =>
    {
      var nbRdv = 0;
      var argent = 0;
      var res = {};
      this.calendar.listEventsInRange(debut,fin).then(data=>{
        if (data.length == 0)
        {
          resolve(false);
        }
        else
        {
          var promise = new Promise((resolve, reject) =>
          {
            data.forEach((ev,index,array)=> {
              if(ev.calendar_id == this.calendarId && ev.eventLocation == "Zong Art Bel")
              {
                nbRdv += 1;
                var split = ev.title.split(",");
                argent += parseInt(split[1]);
              }
              if (index === array.length -1)
              resolve();
            });
          });
          promise.then(() => {
            res = {
              'argent' : argent,
              'nbRdv' : nbRdv
            };
            resolve(res);
          });
        }
      },
      error=>{
        reject("Can\'t get list of rdv"+error);
      });
    });
  }
}
