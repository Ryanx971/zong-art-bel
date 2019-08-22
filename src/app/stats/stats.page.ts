/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-15T12:53:34+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T15:56:11+02:00
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
  displayDate: string;
  nbRdv: number;
  money: number;
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
    this.displayDate = this.calendar.MONTHS[parseInt(month)-1] + " " + year;
    let startDate = new Date(year, month-1, 1);
    let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    this.calendar.getMonthBenefits(startDate, endDate).then(res => {
        this.money = res.money;
        this.nbRdv = res.nbRdv;
        if(this.nbRdv === 0)
          this.toast.show("Vous n'avez pas effectué  de prestation en " + this.displayDate + ".", "danger-toast", "bottom", 6000);
        this.visible = true;
    }, e => {
      console.error("Error get month benefits", e);
      this.visible = false;
    });
  }
}
