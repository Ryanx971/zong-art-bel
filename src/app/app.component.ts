/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-13T22:24:39+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-15T20:46:35+02:00
 */



import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SERVICES } from './settings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage
  ) {
    this.checkFirstTime();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString("#CC4159");
      this.splashScreen.hide();
    });
  }

  checkFirstTime() {
    // On remplit la "customers" au premier lancement
    this.nativeStorage.getItem('first_time_customers').catch(() => {
        this.nativeStorage.setItem('first_time_customers', "true");
        let customers = ["Angelique"];
        this.nativeStorage.setItem('customers', customers);
      });

    this.nativeStorage.getItem('first_time_services').catch(() => {
      this.nativeStorage.setItem("services", SERVICES);
      this.nativeStorage.setItem('first_time_services', "true");
    });
  }
}
