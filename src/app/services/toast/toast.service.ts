/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-15T11:44:20+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T11:45:31+02:00
 */



import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum positionEnum {
  middle = "middle",
  bottom = "bottom",
  top = "top",
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastCtrl: ToastController,
  ) { }

  async show(msg: string, css: string, position: string, duration: number) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: positionEnum[position],
      duration: duration,
      cssClass: css
    });
    toast.present();
  }
}
