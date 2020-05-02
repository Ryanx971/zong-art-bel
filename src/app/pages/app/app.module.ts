import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadDefaultComponent } from '../../components/service/load-default/load-default.component';
import { PopoverComponent } from '../../components/customer/popover/popover.component';

import { Calendar } from '@ionic-native/calendar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';

@NgModule({
  declarations: [AppComponent, LoadDefaultComponent, PopoverComponent],
  entryComponents: [LoadDefaultComponent, PopoverComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    Calendar,
    NativeStorage,
    SocialSharing,
    Dialogs,
    Contacts,
    SMS,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
