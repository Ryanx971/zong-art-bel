import { Calendar } from '@ionic-native/calendar';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { CalendarProvider } from '../../providers/calendar/calendar';

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
    private calendar: Calendar,
    private calProvider: CalendarProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log("Ouverture de la page d'accueil");
    this.calProvider.countDayRdv().then(resolve =>
    {
      this.nbrRdv = resolve;
    },
    reject =>
    {
      this.nbrRdv = reject;
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
