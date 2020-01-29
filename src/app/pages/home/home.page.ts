import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar/calendar.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'Zong Art Bel';
  // rdvInProgress:string = "Aucun rendez-vous aujourd'hui";

  constructor(private calendar: CalendarService, private router: Router) {}

  ionViewWillEnter() {
    // this.calendar.getRdvOfDay().then(nbr => {
    //   this.rdvInProgress = "Il vous reste "+ nbr +" rendez-vous aujourd'hui";
    // });
  }

  openCalendar(date: Date = null) {
    this.calendar.openCalendar(date);
  }

  open(path: string) {
    this.router.navigate([path]);
  }
}
