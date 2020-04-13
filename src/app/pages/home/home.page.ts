import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar/calendar.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_FIRST_TIME } from 'src/app/constants/app.constant';
import { ContactService } from 'src/app/services/contact/contact.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title = 'Zong Art Bel';
  // rdvInProgress:string = "Aucun rendez-vous aujourd'hui";

  constructor(
    private calendar: CalendarService,
    private router: Router,
    private nativeStorage: NativeStorage,
    private contactService: ContactService,
    private toastService: ToastService,
    public alertController: AlertController,
  ) {}

  ionViewWillEnter() {
    // this.calendar.getRdvOfDay().then(nbr => {
    //   this.rdvInProgress = "Il vous reste "+ nbr +" rendez-vous aujourd'hui";
    // });

    this.nativeStorage.getItem(STORAGE_FIRST_TIME).catch(() => {
      this.nativeStorage.setItem(STORAGE_FIRST_TIME, 'true');
      this.showAlert();
    });
  }

  openCalendar = (date: Date = null) => {
    this.calendar.openCalendar(date);
  };

  open = (path: string) => {
    this.router.navigate([path]);
  };

  private async showAlert() {
    const header: string = 'Synchronisation des contacts';
    const message: string =
      "Afin d'envoyer des messages à vos clients la veille des rendez-vous, il serait préférable de synchroniser vos contacts avec l'application. Vous pouvez syncroniser vos contactes dès maintenant ou vous rendre dans <strong>les paramètres</strong>.";
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Je le ferais plus tard',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Synchroniser mes contacts',
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
}
