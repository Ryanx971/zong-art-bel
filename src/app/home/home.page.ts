/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-13T22:24:39+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T11:55:26+02:00
 */



import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { CalendarService } from '../calendar.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  title:string = "Zong'Aw Bel";
  rdvInProgress:string = "Aucun rendez-vous aujourd'hui";
  calendarId: number = 0;
  months: Array<string> = [
   "Janvier", "Fevrier", "Mars",
   "Avril", "Mai", "Juin", "Juillet",
   "Août", "Septembre", "Octobre",
   "Novembre", "Decembre"
  ];

  constructor(
    private calendar: CalendarService,
    private router: Router
  ) {
  }

  ionViewWillEnter(){
    this.calendar.getRdvOfDay().then(nbr => {
      this.rdvInProgress = "Il vous reste "+ nbr +" rendez-vous aujourd'hui";
    });
  }

  openCalendar(date: Date = null) {
    this.calendar.openCalendar(date);
  }

  open(path: string){
    this.router.navigate([path]);
  }


}
