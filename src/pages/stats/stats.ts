import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { Toast } from '@ionic-native/toast';

import { CalendarProvider } from '../../providers/calendar/calendar';

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
  calendarId: number = 0;

  constructor(
    navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private calendar: Calendar,
    private toast: Toast,
    private calProvider: CalendarProvider
  )
    {
      this.statsForm = this.formBuilder.group({
        moisAnnee: ['', Validators.required]
      });
    }


  ionViewDidLoad() {
    console.log('Ouverture StatsPage');
    this.calProvider.checkCalendar();
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
      var moisAnnee = this.statsForm.controls['moisAnnee'].value.split("-");
      // moisAnnee[0] = Année
      // moisAnnee[1] = Mois
      let startDate = new Date(moisAnnee[0],moisAnnee[1]-1,1);
      let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      this.mois = tabMois[startDate.getMonth()]+" "+startDate.getFullYear();
      this.calendar.listEventsInRange(startDate, endDate).then(data=>{
        if (data.length == 0)
        {
          this.toast.show(`Vous n'avez pas réaliser de rendez-vous durant ce mois`, '5000', 'bottom').subscribe(toast => {});
          this.visibleCard = false;
        }
        else
        {
          data.forEach(ev=> {
            if(ev.calendar_id == this.calProvider.calendarId && ev.eventLocation == "Zong Art Bel")
            {
              this.nbRdv += 1;
              var split = ev.title.split(",");
              if(split[1]!= null)
              {
                this.argent+= parseInt(split[1]);
              }
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
