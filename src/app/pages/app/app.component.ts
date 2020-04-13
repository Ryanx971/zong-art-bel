import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SERVICES } from '../../settings';
import { CronService } from 'src/app/services/cron/cron.service';
import {
  STORAGE_FIRST_CUSTOMERS,
  STORAGE_FIRST_SERVICES,
  STORAGE_CUSTOMERS,
  STORAGE_SERVICES,
} from '../../constants/app.constant';

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
    private cronService: CronService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // CUSTOMER
      this.nativeStorage.getItem(STORAGE_FIRST_CUSTOMERS).catch(() => {
        this.nativeStorage.setItem(STORAGE_FIRST_CUSTOMERS, 'true');
        this.nativeStorage.setItem(STORAGE_CUSTOMERS, []);
      });

      // SERVICE
      this.nativeStorage.getItem(STORAGE_FIRST_SERVICES).catch(() => {
        this.nativeStorage.setItem(STORAGE_SERVICES, SERVICES);
        this.nativeStorage.setItem(STORAGE_FIRST_SERVICES, 'true');
      });

      // Lancement de cron
      this.cronService.runMsgCron();

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#CC4159');
      this.splashScreen.hide();
    });
  }
}
