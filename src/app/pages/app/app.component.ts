import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {
  SERVICES,
  DEFAULT_SYNC_KEY,
  DEFAULT_MESSAGE_ENABLED,
  DEFAULT_MESSAGE_TIME,
  DEFAULT_MESSAGE_TEXT,
} from '../../settings';
import {
  STORAGE_FIRST_CUSTOMERS,
  STORAGE_FIRST_SERVICES,
  STORAGE_CUSTOMERS,
  STORAGE_SERVICES,
  STORAGE_CALENDAR,
  STORAGE_SYNC_KEY,
  STORAGE_MESSAGE_ENABLED,
  STORAGE_MESSAGE_TIME,
  STORAGE_MESSAGE_TEXT,
  STORAGE_CRON,
} from '../../constants/app.constant';
import { CronService } from 'src/app/services/cron/cron.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

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
    private backgroundMode: BackgroundMode,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this._defaultStorage();
      this._manageBackgroundMode();

      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#CC4159');
      this.splashScreen.hide();

      // Lancement de cron
      this.cronService.runMsgCron();
    });
  }

  _defaultStorage = (): void => {
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

    // SYNC KEY
    this.nativeStorage.getItem(STORAGE_SYNC_KEY).catch(() => {
      this.nativeStorage.setItem(STORAGE_SYNC_KEY, DEFAULT_SYNC_KEY);
    });

    // CALENDAR
    this.nativeStorage.getItem(STORAGE_CALENDAR).catch(() => {
      this.nativeStorage.setItem(STORAGE_CALENDAR, null);
    });

    // MESSAGE ENABLED
    this.nativeStorage.getItem(STORAGE_MESSAGE_ENABLED).catch(() => {
      this.nativeStorage.setItem(STORAGE_MESSAGE_ENABLED, DEFAULT_MESSAGE_ENABLED);
    });

    // MESSAGE TIME
    this.nativeStorage.getItem(STORAGE_MESSAGE_TIME).catch(() => {
      this.nativeStorage.setItem(STORAGE_MESSAGE_TIME, DEFAULT_MESSAGE_TIME);
    });

    // MESSAGE END TEXT
    this.nativeStorage.getItem(STORAGE_MESSAGE_TEXT).catch(() => {
      this.nativeStorage.setItem(STORAGE_MESSAGE_TEXT, DEFAULT_MESSAGE_TEXT);
    });

    // CRON
    this.nativeStorage.getItem(STORAGE_CRON).catch(() => {
      this.nativeStorage.setItem(STORAGE_CRON, undefined);
    });
  };

  _manageBackgroundMode = (): void => {
    // Background mode
    this.backgroundMode.excludeFromTaskList();
    this.backgroundMode.on('activate').subscribe(() => {
      // this.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.disableWebViewOptimizations();
    });
    // this.backgroundMode.setDefaults({
    //   silent: true,
    // });
    if (!this.backgroundMode.isEnabled()) this.backgroundMode.enable();
  };
}
