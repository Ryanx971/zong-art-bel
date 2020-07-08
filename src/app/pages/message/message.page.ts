import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_MESSAGE_ENABLED, STORAGE_MESSAGE_TIME, STORAGE_MESSAGE_TEXT } from 'src/app/constants/app.constant';
import { CronService } from 'src/app/services/cron/cron.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage {
  title = 'Paramètres des messages';
  messageTime: string = null;
  messageEnabled: boolean = null;
  messageText: string = null;
  SUCCESS_MESSAGE = 'Modification effectuée avec succès';
  ERROR_MESSAGE = "Erreur, impossible d'effectuer la modification, veuillez réesayer";

  constructor(
    private toastService: ToastService,
    private nativeStorage: NativeStorage,
    private cronService: CronService,
  ) {
    this.loadData();
  }

  ionViewWillEnter() {}

  private loadData(): void {
    this.nativeStorage.getItem(STORAGE_MESSAGE_ENABLED).then(
      (data: boolean) => {
        this.messageEnabled = data;
      },
      (e: any) => {
        console.error('Error in getItem', e);
        this.toastService.show(
          "Erreur, impossible de savoir si l'envoi de message est activé",
          'danger-toast',
          'bottom',
          4000,
        );
      },
    );
    this.nativeStorage.getItem(STORAGE_MESSAGE_TIME).then(
      (data: string) => (this.messageTime = data),
      (e: any) => {
        console.error('Error in getItem', e);
        this.toastService.show(
          "Erreur, impossible de récupérer la date d'envoi des messages",
          'danger-toast',
          'bottom',
          4000,
        );
      },
    );
    this.nativeStorage.getItem(STORAGE_MESSAGE_TEXT).then(
      (data: string) => (this.messageText = data),
      (e: any) => {
        console.error('Error in getItem', e);
        this.toastService.show(
          'Erreur, impossible de récupérer le message personalisé',
          'danger-toast',
          'bottom',
          4000,
        );
      },
    );
  }

  onToggleChange(event: any): void {
    this.nativeStorage.setItem(STORAGE_MESSAGE_ENABLED, event.target.checked).then(
      () => {
        this.cronService.toogleCron(event.target.checked);
        this.toastService.show(this.SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000);
      },
      (e: any) => {
        console.error('Error in setItem', e);
        this.toastService.show(this.ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
      },
    );
  }

  onInputTimeChange(event: any): void {
    this.nativeStorage.setItem(STORAGE_MESSAGE_TIME, event.target.value).then(
      () => {
        this.cronService.setTime(event.target.value);
        this.toastService.show(this.SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000);
      },
      (e: any) => {
        console.error('Error in setItem', e);
        this.toastService.show(this.ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
      },
    );
  }

  onInputTextBlur(event: any): void {
    if (event.target.value) {
      this.nativeStorage.setItem(STORAGE_MESSAGE_TEXT, event.target.value).then(
        () => this.toastService.show(this.SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000),
        (e: any) => {
          console.error('Error in setItem', e);
          this.toastService.show(this.ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
        },
      );
    }
  }

  runTest = (event: any): void => {
    // TODO: should be a private method
    this.cronService.doCron();
  };
}
