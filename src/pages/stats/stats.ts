import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {
  titre: string = "Mes statistiques";
  statsForm: FormGroup;
  mois: string;
  nbRdv: number = 0;
  argent: number = 0;
  visibleCard: boolean = false;

  constructor(
    navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private calendar: Calendar)
    {
      this.statsForm = this.formBuilder.group({
        moisAnnee: ['', Validators.required]
      });
    }


  ionViewDidLoad() {
    console.log('Ouverture StatsPage');
  }

  changeDateStats(){
    if (this.statsForm.valid){
      this.argent = 0;
      this.nbRdv = 0;
      var tabMois = [
       "Janvier", "Fevrier", "Mars",
       "Avril", "Mai", "Juin", "Juillet",
       "Août", "Septembre", "Octobre",
       "Novembre", "Decembre"
      ];
      var moisAnnee = this.statsForm.controls['moisAnnee'].value;
      let startDate = new Date(moisAnnee + "-01T02:00:00.000Z");
      let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 2, 0);
      this.mois = tabMois[startDate.getMonth()]+" "+startDate.getFullYear();
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
        data.forEach(ev=> {
          if(ev.eventLocation == "Zong Art Bel")
          {
            this.nbRdv += 1;
            var split = ev.title.split(",");
            this.argent+= parseInt(split[1]);
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
