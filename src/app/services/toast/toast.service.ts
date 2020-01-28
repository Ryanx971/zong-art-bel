import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export enum positionEnum {
  middle = 'middle',
  bottom = 'bottom',
  top = 'top',
}

export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(msg: string, css: string, position: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: positionEnum[position],
      duration,
      cssClass: css,
    });
    toast.present();
  }
}
