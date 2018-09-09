import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  // Liste des événéments
  events: any[] = [];
  // Nombre de Rdv
  nbRdv: number = 0;
  // Argent pour le mois
  argent: number = 0;
  // Visibilité de la carte affichant les prix
  visibleCard: boolean = false;
  // Mois et Année
  moisAnnee: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, private calendar: Calendar) {
  }

  // Verification des saisies
  public verification(): boolean {
    var champs = "";
    if (this.moisAnnee == null) {
      champs += "Mois & Année";
    }
    if (champs == "") {
      return true;
    }
    else {
      // Toast affichant les champs manquants
      let toast = this.toastCtrl.create(
        {
          message: 'Erreur, veuillez remplir : ' + champs + ".",
          duration: 4000
        });
      toast.present();
      return false;
    }
  }

  ionViewDidLoad() {
    console.log('Ouverture de la page Statistiques');
  }

  public changeDateStats(): void {
    var money = 0;
    if (this.verification()) {
      let startDate = new Date(this.moisAnnee + "-01T00:00:00.000Z");
      let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
        this.events = data;
        this.nbRdv = this.events.length;
        this.events.forEach(ev=> {
          if(ev.eventLocation)
          {
            this.argent+= parseInt(ev.eventLocation);
          }
        });
        this.visibleCard = true;
      },
      error=>{
        console.log("Can\'t get list of rdv");
      });
    }
    else {
      this.visibleCard = false;
    }

  }

}
