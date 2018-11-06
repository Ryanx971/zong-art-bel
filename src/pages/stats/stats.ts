import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar } from '@ionic-native/calendar';
import { Toast } from '@ionic-native/toast';

import { CalendarProvider } from '../../providers/calendar/calendar';
import { Chart } from 'chart.js';

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

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;

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
    this.calProvider.checkCalendar().then(vrai =>
    {
      this.calProvider.graphValue().then(val =>
      {
        console.log(JSON.stringify(val));
      },
      rejectGraphValue =>
      {
        console.log(rejectGraphValue);
      });
    },
    rejectCheckCalendar =>
    {
      console.log("Le calendrier ZAB n'existe pas");
    });

    // this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    //         type: 'line',
    //         data: {
    //             labels: ["January", "February", "March", "April", "May", "June", "July"],
    //             datasets: [
    //                 {
    //                     label: "My First dataset",
    //                     fill: false,
    //                     lineTension: 0.1,
    //                     backgroundColor: "rgba(75,192,192,0.4)",
    //                     borderColor: "rgba(75,192,192,1)",
    //                     borderCapStyle: 'butt',
    //                     borderDash: [],
    //                     borderDashOffset: 0.0,
    //                     borderJoinStyle: 'miter',
    //                     pointBorderColor: "rgba(75,192,192,1)",
    //                     pointBackgroundColor: "#fff",
    //                     pointBorderWidth: 1,
    //                     pointHoverRadius: 5,
    //                     pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //                     pointHoverBorderColor: "rgba(220,220,220,1)",
    //                     pointHoverBorderWidth: 2,
    //                     pointRadius: 1,
    //                     pointHitRadius: 10,
    //                     data: [65, 59, 80, 81, 56, 55, 40],
    //                     spanGaps: false,
    //                 }
    //             ]
    //         }
    //
    //     });
  }

  changeDateStats(){
    if (this.statsForm.valid){
      this.argent = 0;
      this.nbRdv = 0;
      var moisAnnee = this.statsForm.controls['moisAnnee'].value.split("-");
      // moisAnnee[0] = Année
      // moisAnnee[1] = Mois
      let startDate = new Date(moisAnnee[0],moisAnnee[1]-1,1);
      let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      this.mois = this.calProvider.tabMois[startDate.getMonth()]+" "+startDate.getFullYear();
      this.calProvider.getMonthMoney(startDate,endDate).then(res =>
      {
        if(res==false)
        {
          this.toast.show(`Vous n'avez pas réaliser de rendez-vous durant ce mois`, '5000', 'bottom').subscribe(toast => {});
          this.visibleCard = false;
        }
        else
        {
          this.argent = res["argent"];
          this.nbRdv = res["nbRdv"];
          this.visibleCard = true;
        }
      },
      e =>
      {
        console.log(e);
      });
    }
    else
    {
      this.visibleCard = false;
    }
  }
}
