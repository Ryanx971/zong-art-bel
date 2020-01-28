import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SERVICES, CUSTOMERS } from '../../settings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // On remplit la "customers" au premier lancement
      this.nativeStorage.getItem('first_time_customers').catch(() => {
        this.nativeStorage.setItem('first_time_customers', 'true');
        console.log('Set default customers');
        let customers = CUSTOMERS;
        this.nativeStorage.setItem('customers', customers);
      });

      this.nativeStorage.getItem('first_time_services').catch(() => {
        console.log('Set default services');
        this.nativeStorage.setItem('services', SERVICES);
        this.nativeStorage.setItem('first_time_services', 'true');
      });

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#CC4159');
      this.splashScreen.hide();
    });
  }
}
