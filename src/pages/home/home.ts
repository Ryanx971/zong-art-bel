import { Calendar } from '@ionic-native/calendar';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  titre: string = "Zong Art Bel";
  nbrRdv: string = "";

  constructor(
    public navCtrl: NavController,
    private calendar: Calendar
  ) {
  }

  ionViewDidLoad() {
    console.log("Ouverture de la page d'accueil");
    let startDate = new Date();
    console.log(startDate);
    let endDate = new Date();
    endDate.setHours(23,59,59,999);
    console.log(endDate)

    var count = 0;
    this.calendar.listEventsInRange(startDate, endDate).then(data=>{
        data.forEach(ev=> {
          if(ev.eventLocation == "Zong Art Bel")
          {
            count += 1;
          }
        });
        if(count > 0)
          this.nbrRdv = "Il vous reste "+count+" rendez-vous aujourd'hui";
      },
      error=>{
        console.log("Can\'t get list of rdv");
      });
  }

  openRdvPage() {
    this.navCtrl.push('RdvPage');
  }

  openStatsPage() {
    this.navCtrl.push('StatsPage');
  }

  openCalendar(){
    this.calendar.openCalendar(new Date());
  }
}
