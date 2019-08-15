/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-15T12:53:34+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T14:51:45+02:00
 */



import { Component, OnInit } from '@angular/core';

import { CalendarService } from '../calendar.service';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  title: string = "Mes statistiques";
  mois: string;
  nbRdv: number;
  argent: number;
  visible: boolean = false;
  monthYear: any;

  constructor(
    private calendar: CalendarService,
    private toast: ToastService
  ) {
  }

  ngOnInit() {
  }

  monthChange() {
    let monthYear = this.monthYear.split("-");
    let month = monthYear[1];
    let year = monthYear[0];
    let startDate = new Date(year, month-1, 1);
    let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    // this.mois = this.calProvider.tabMois[startDate.getMonth()]+" "+startDate.getFullYear();
    // this.calProvider.getMonthMoney(startDate,endDate).then(res =>
    // {
    //   if(res==false)
    //   {
    //     this.toast.show(`Vous n'avez pas réaliser de rendez-vous durant ce mois`, '5000', 'bottom').subscribe(toast => {});
    //     this.visibleCard = false;
    //   }
    //   else
    //   {
    //     this.argent = res["argent"];
    //     this.nbRdv = res["nbRdv"];
    //     this.visibleCard = true;
    //   }
  }

}
