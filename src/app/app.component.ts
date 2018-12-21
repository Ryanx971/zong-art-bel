import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Calendar } from '@ionic-native/calendar';
import { NativeStorage } from '@ionic-native/native-storage';


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
    private nativeStorage: NativeStorage,
    private calendar: Calendar
  )
  {
    platform.ready().then(() => {

      // On remplit la "cliente-liste" au premier lancement
      this.nativeStorage.getItem('first')
      .then(data =>{},
        error => {
          this.nativeStorage.setItem('first', "done")
          .then(() => console.log('Stored item!'),
            error => console.error('Error storing item', error));

          var array = ["Angelique"];
          this.nativeStorage.setItem('cliente-liste', array)
          .then(() => console.log('Stored item!'),
            error => console.error('Error storing item', error));
        });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString("#CC4159");
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
