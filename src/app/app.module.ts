import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Calendar } from '@ionic-native/calendar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Dialogs } from '@ionic-native/dialogs';
import { NativeStorage } from '@ionic-native/native-storage';
import { Toast } from '@ionic-native/toast';

import { CalendarProvider } from './../providers/calendar/calendar';



import { MyApp } from './app.component';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Calendar,
    SocialSharing,
    Dialogs,
    NativeStorage,
    Toast,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CalendarProvider
  ]
})
export class AppModule {}
