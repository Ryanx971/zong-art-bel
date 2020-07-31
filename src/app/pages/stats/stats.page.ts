import { Component, OnInit } from '@angular/core';
import { CalendarService, Benefit } from '../../services/calendar/calendar.service';
import { ToastService } from '../../services/toast/toast.service';
import { MONTHS } from '../../constants/app.constant';
import { text } from 'src/app/utils/text';
import { ToastColor, ToastPosition } from 'src/app/utils/enumeration';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  title = text('statPageTitle');
  displayDate: string;
  benefit: Benefit = { nbVisit: 0, sum: 0 };
  visible = false;
  monthYear: any;

  constructor(private calendarService: CalendarService, private toastService: ToastService) {}

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
    this.calendarService.getMonthBenefits(startDate, endDate).then(
      (data: Benefit) => {
        this.benefit = data;
        if (this.benefit.nbVisit === 0) {
          this.toastService.show(
            "Vous n'avez pas effectué de prestation en " + this.displayDate + '.',
            ToastColor.ERROR,
            ToastPosition.BOTTOM,
            6000,
          );
        }
        this.visible = true;
      },
      (e) => {
        this.toastService.show(
          'Erreur, impossible de récupérer les bénéfices du mois de ' + this.displayDate,
          ToastColor.ERROR,
          ToastPosition.BOTTOM,
          5000,
        );
        this.visible = false;
      },
    );
  }
}
