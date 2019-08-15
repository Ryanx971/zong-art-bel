/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-13T22:24:39+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-14T20:27:30+02:00
 */



import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // On remplit la "customers" au premier lancement
      this.nativeStorage.getItem('first_time').catch(() => {
          this.nativeStorage.setItem('first_time', "true");
          var array = ["Angelique"];
          this.nativeStorage.setItem('customers', array);
        });
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString("#CC4159");
      this.splashScreen.hide();
    });
  }
}
