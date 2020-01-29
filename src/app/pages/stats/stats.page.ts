import { Component, OnInit } from '@angular/core';
import { CalendarService, Benefit } from '../../services/calendar/calendar.service';
import { ToastService } from '../../services/toast/toast.service';
import { MONTHS } from '../../constants/app.constant';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  title = 'Mes statistiques';
  displayDate: string;
  benefit: Benefit = { nbVisit: 0, sum: 0 };
  visible = false;
  monthYear: any;

  constructor(private calendar: CalendarService, private toast: ToastService) {}

  ngOnInit() {}

  /**
   * Dès que le mois change, on calcul les bénéfices
   */
  monthChange() {
    const monthYear = this.monthYear.split('-');
    const month = monthYear[1];
    const year = monthYear[0];
    this.displayDate = MONTHS[parseInt(month, 10) - 1] + ' ' + year;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    this.calendar.getMonthBenefits(startDate, endDate).then(
      (data: Benefit) => {
        this.benefit = data;
        if (this.benefit.nbVisit === 0) {
          this.toast.show(
            // tslint:disable-next-line: quotemark
            "Vous n'avez pas effectué de prestation en " + this.displayDate + '.',
            'danger-toast',
            'bottom',
            6000,
          );
        }
        this.visible = true;
      },
      e => {
        console.error('Erreur, impossible de récupérer les bénéfices [Get Month Benefits].', e);
        this.visible = false;
      },
    );
  }
}
