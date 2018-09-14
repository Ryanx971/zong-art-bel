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

  constructor(
    public navCtrl: NavController,
    private calendar: Calendar
  ) {
  }

  ionViewDidLoad() {
    console.log("Ouverture de la page d'accueil");
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
