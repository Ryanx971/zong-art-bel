import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_MESSAGE_ENABLED, STORAGE_MESSAGE_TIME, STORAGE_MESSAGE_TEXT } from 'src/app/constants/app.constant';
import { CronService } from 'src/app/services/cron/cron.service';
import { text } from 'src/app/utils/text';
import { ToastColor, ToastPosition } from 'src/app/utils/enumeration';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage {
  title = text('messagePageTitle');
  messageTime: string = null;
  messageEnabled: boolean = null;
  messageText: string = null;
  SUCCESS_MESSAGE = text('messagePageSuccessMessage');
  ERROR_MESSAGE = text('messagePageERRORMessage');

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
        console.error(text('errorNSGetMessageEnabled'), e);
        this.toastService.show(text('errorNSGetMessageEnabled'), ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
    this.nativeStorage.getItem(STORAGE_MESSAGE_TIME).then(
      (data: string) => (this.messageTime = data),
      (e: any) => {
        console.error(text('errorNSGetMessageTime'), e);
        this.toastService.show(text('errorNSGetMessageTime'), ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
    this.nativeStorage.getItem(STORAGE_MESSAGE_TEXT).then(
      (data: string) => (this.messageText = data),
      (e: any) => {
        console.error(text('errorNSGetMessageText'), e);
        this.toastService.show(text('errorNSGetMessageText'), ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
  }

  onToggleChange(event: any): void {
    this.nativeStorage.setItem(STORAGE_MESSAGE_ENABLED, event.target.checked).then(
      () => {
        this.cronService.toogleCron(event.target.checked);
        this.toastService.show(this.SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000);
      },
      (e: any) => {
        console.error(this.ERROR_MESSAGE, e);
        this.toastService.show(this.ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
  }

  onInputTimeChange(event: any): void {
    this.nativeStorage.setItem(STORAGE_MESSAGE_TIME, event.target.value).then(
      () => {
        this.cronService.setTime(event.target.value);
        this.toastService.show(this.SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000);
      },
      (e: any) => {
        console.error(this.ERROR_MESSAGE, e);
        this.toastService.show(this.ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
      },
    );
  }

  onInputTextBlur(event: any): void {
    if (event.target.value) {
      this.nativeStorage.setItem(STORAGE_MESSAGE_TEXT, event.target.value).then(
        () => this.toastService.show(this.SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000),
        (e: any) => {
          console.error(this.ERROR_MESSAGE, e);
          this.toastService.show(this.ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 4000);
        },
      );
    }
  }

  runTest = (event: any): void => {
    // TODO: should be a private method
    this.cronService.doCron();
  };
}
