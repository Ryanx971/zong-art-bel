import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ToastPosition } from 'src/app/utils/enumeration';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(msg: string, css: string, position: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: ToastPosition[position],
      duration,
      cssClass: css,
    });
    toast.present();
  }
}
