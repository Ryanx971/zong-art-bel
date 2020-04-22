import { Component } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CalendarType } from 'src/app/models/CalendarType';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_CALENDAR, STORAGE_SYNC_KEY } from 'src/app/constants/app.constant';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.page.html',
  styleUrls: ['./parameter.page.scss'],
})
export class ParameterPage {
  title = 'Paramètres de synchronisation';
  calendars: CalendarType[] = [];
  syncKey: string = null;
  currentCalendarId: string | null;
  SUCCESS_MESSAGE = 'Modification effectuée avec succès';
  ERROR_MESSAGE = "Erreur, impossible d'effectuer la modification, veuillez réesayer";

  constructor(
    private calendarService: CalendarService,
    private toastService: ToastService,
    private nativeStorage: NativeStorage,
  ) {
    this.loadData();
  }

  ionViewWillEnter() {}

  private loadData(): void {
    this.calendarService.getCalendars().then(
      (data: CalendarType[]) => {
        this.calendars = data;
      },
      (e: string) => this.toastService.show(e, 'danger-toast', 'bottom', 4000),
    );
    this.nativeStorage.getItem(STORAGE_CALENDAR).then(
      (data: string | null) => {
        this.currentCalendarId = data;
      },
      (e: any) => {
        console.error('Error in getItem', e);
        this.toastService.show(
          'Erreur, impossible de récupérer le calendrier sélectionné',
          'danger-toast',
          'bottom',
          4000,
        );
      },
    );
    this.nativeStorage.getItem(STORAGE_SYNC_KEY).then(
      (data: string | null) => (this.syncKey = data),
      (e: any) => {
        console.error('Error in getItem', e);
        this.toastService.show(
          'Erreur, impossible de récupérer le mot clé de synchronisation sélectionné',
          'danger-toast',
          'bottom',
          4000,
        );
      },
    );
  }

  /**
   * Dès que le choix de calendrier change
   */
  onSelectChange(event: any): void {
    if (event.detail.value) {
      this.nativeStorage.setItem(STORAGE_CALENDAR, event.detail.value).then(
        () => this.toastService.show(this.SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000),
        (e: any) => {
          console.error('Error in setItem', e);
          this.toastService.show(this.ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
        },
      );
    }
  }

  /**
   * Dès que le choix du mot clé change
   */
  onInputBlur(event: any): void {
    if (event.target.value) {
      this.nativeStorage.setItem(STORAGE_SYNC_KEY, event.target.value).then(
        () => this.toastService.show(this.SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000),
        (e: any) => {
          console.error('Error in setItem', e);
          this.toastService.show(this.ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
        },
      );
    }
  }
}
