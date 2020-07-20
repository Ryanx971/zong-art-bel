import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar/calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_FIRST_TIME, STORAGE_CALENDAR } from 'src/app/constants/app.constant';
import { ContactService } from 'src/app/services/contact/contact.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { text } from 'src/app/utils/text';

interface IMenu {
  open: string;
  icon: string;
  alt: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title: string = text('homePageTitle');
  rdvInProgress: string = text('noAppointmentInProgress');

  menu: IMenu[] = [
    {
      title: text('menuCalendarTitle'),
      open: 'Calendar',
      icon: 'assets/icon/calendar.svg',
      alt: text('menuCalendarTitle'),
    },
    {
      title: text('menuAppointmentTitle'),
      open: '/rdv/add',
      icon: 'assets/icon/add.svg',
      alt: text('menuAppointmentTitle'),
    },
    {
      title: text('menuStatsTitle'),
      open: '/stats',
      icon: 'assets/icon/stat.svg',
      alt: text('menuStatsTitle'),
    },
    {
      title: text('menuParamTitle'),
      open: '/config',
      icon: 'assets/icon/settings.svg',
      alt: text('menuParamTitle'),
    },
  ];
  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private nativeStorage: NativeStorage,
    private contactService: ContactService,
    private toastService: ToastService,
    public alertController: AlertController,
  ) {}

  ionViewWillEnter() {
    this.calendarService.getDailyRdv().then(
      (nbRdv: number) => {
        this.rdvInProgress = 'Il vous reste ' + nbRdv + " rendez-vous aujourd'hui";
      },
      (e: string) => (this.rdvInProgress = e),
    );

    this.nativeStorage.getItem(STORAGE_FIRST_TIME).catch(() => {
      this.nativeStorage.setItem(STORAGE_FIRST_TIME, 'true');
      this.showSyncAlert();
    });

    this.nativeStorage.getItem(STORAGE_CALENDAR).then((data: string | null) => {
      if (data === null) this.showCalendarAlert();
    });
  }

  openCalendar = (date: Date = null) => {
    this.calendarService.openCalendar(date);
  };

  open = (path: string, date: Date = null) => {
    if (path === 'Calendar') {
      this.calendarService.openCalendar(date);
      return;
    }
    this.router.navigate([path]);
  };

  private async showSyncAlert() {
    const header: string = text('syncAlertHeader');
    const message: string = text('syncAlertMessage');
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: text('syncAlertCancelBtn'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: text('syncAlertSyncBtn'),
          handler: () => {
            this.contactService
              .synchronize()
              .then(
                (msg: string) => {
                  this.toastService.show(msg, 'success-toast', 'bottom', 4000);
                },
                (e: string) => {
                  this.toastService.show(e, 'danger-toast', 'bottom', 4000);
                },
              )
              .finally(() => {
                return true;
              });
          },
        },
      ],
    });
    await alert.present();
  }

  private async showCalendarAlert() {
    const header: string = text('calendarAlertHeader');
    const message: string = text('calendarAlertMessage');
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: text('calendarAlertCancelBtn'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: text('calendarAlertOkBtn'),
          handler: () => {
            this.router.navigate(['parameters']);
          },
        },
      ],
    });
    await alert.present();
  }
}
