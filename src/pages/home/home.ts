import { Calendar } from '@ionic-native/calendar';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RdvPage } from '../rdv/rdv';
import { StatsPage } from '../stats/stats';


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

  openPage(nomPage) {
    console.log(typeof nomPage);
    this.navCtrl.push(nomPage);
  }

  // Renvoie vers le calendrier a la date du jours
  openCalendar(){
    this.calendar.openCalendar(new Date());
  }


}
