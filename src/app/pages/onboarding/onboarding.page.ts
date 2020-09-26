import { Component, ViewChild } from '@angular/core';
import { text } from 'src/app/utils';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['onboarding.page.scss'],
})
export class OnBoardingPage {
  title: string = text('onBoardingPageTitle');

  @ViewChild('slideNav', { static: false }) slideNav: IonSlides;

  slider: any;

  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    // slidesPerView: 1,
  };

  constructor() {
    this.slider = {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
    };
  }

  //Move to Next slide
  slideNext() {
    this.slider.slideNext(500).then(() => {
      this.checkIfNavDisabled();
    });
  }

  //Move to previous slide
  slidePrev() {
    this.slider.slidePrev(500).then(() => {
      this.checkIfNavDisabled();
    });
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange() {
    this.checkIfNavDisabled();
  }

  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled() {
    this.checkisBeginning();
    this.checkisEnd();
  }

  checkisBeginning() {
    this.slider.isBeginning().then((istrue: boolean) => {
      this.slider.isBeginningSlide = istrue;
    });
  }

  checkisEnd() {
    this.slider.isEnd().then((istrue: boolean) => {
      this.slider.isEndSlide = istrue;
    });
  }
}
