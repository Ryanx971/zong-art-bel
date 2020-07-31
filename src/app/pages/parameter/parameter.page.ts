import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_CALENDAR, STORAGE_SYNC_KEY } from 'src/app/constants';
import { CalendarType } from 'src/app/models';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { text, ToastColor, ToastPosition } from 'src/app/utils';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.page.html',
  styleUrls: ['./parameter.page.scss'],
})
export class ParameterPage {
  title = text('parameterPageTitle');
  calendars: CalendarType[] = [];
  syncKey: string = null;
  currentCalendarId: string | null;
  SUCCESS_MESSAGE = text('parameterPageSuccessMessage');
  ERROR_MESSAGE = text('parameterPageErrorMessage');

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
      (e: string) => {
        this.toastService.show(e, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
    this.nativeStorage.getItem(STORAGE_CALENDAR).then(
      (data: string | null) => {
        this.currentCalendarId = data;
      },
      (e: any) => {
        console.error(text('errorNSGetStorageCalendar'), e);
        this.toastService.show(text('errorNSGetStorageCalendar'), ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
    this.nativeStorage.getItem(STORAGE_SYNC_KEY).then(
      (data: string | null) => (this.syncKey = data),
      (e: any) => {
        console.error(text('errorNSGetStorageSyncKey'), e);
        this.toastService.show(text('errorNSGetStorageSyncKey'), ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
  }

  /**
   * Dès que le choix de calendrier change
   */
  onSelectChange(event: any): void {
    if (event.detail.value) {
      this.nativeStorage.setItem(STORAGE_CALENDAR, event.detail.value).then(
        () => this.toastService.show(this.SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000),
        (e: any) => {
          console.error(this.ERROR_MESSAGE, e);
          this.toastService.show(this.ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
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
        () => this.toastService.show(this.SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000),
        (e: any) => {
          console.error(this.ERROR_MESSAGE, e);
          this.toastService.show(this.ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
        },
      );
    }
  }
}
