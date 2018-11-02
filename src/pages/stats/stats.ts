import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { Toast } from '@ionic-native/toast';

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
    private calendar: Calendar,
    private toast: Toast)
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
       "janvier", "fevrier", "mars",
       "avril", "mai", "juin", "juillet",
       "août", "septembre", "octobre",
       "novembre", "decembre"
      ];
      console.log(new Date());
      var moisAnnee = new Date(this.statsForm.controls['moisAnnee'].value);
      console.log(moisAnnee.getFullYear());
      console.log(moisAnnee.getMonth());
      let startDate = new Date(moisAnnee.getFullYear()+"-"+moisAnnee.getMonth()+"-01T01:00:00.000Z");
      let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      console.log("Start "+startDate);
      console.log("End "+endDate);
      console.log(new Date());
      this.mois = tabMois[startDate.getMonth()+1]+" "+startDate.getFullYear();
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
        if (data.length == 0)
        {
          this.toast.show(`Vous n'avez pas réaliser de rendez-vous durant ce mois`, '5000', 'bottom').subscribe(toast => {});
          this.visibleCard = false;
        }
        else
        {
          data.forEach(ev=> {
            if(ev.eventLocation == "Zong Art Bel")
            {
              this.nbRdv += 1;
              var split = ev.title.split(",");
              console.log(split[1]);
              console.log(split[0]);
              this.argent+= parseInt(split[1]);
            }
          });
          this.visibleCard = true;
        }
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
