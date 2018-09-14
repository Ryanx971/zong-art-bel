import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Calendar } from '@ionic-native/calendar';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = "HomePage";

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private calendar: Calendar
  )
  {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString("#398564");
      splashScreen.hide();
    });
  }

  openPage(name): void
  {
    if(this.nav.getActive().name != name)
    {
      this.nav.push(name);
    }
  }

  openCalendar()
  {
    this.calendar.openCalendar(new Date());
  }
}
