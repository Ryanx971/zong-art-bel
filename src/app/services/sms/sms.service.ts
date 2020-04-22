import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  constructor(private sms: SMS) {}

  // sendMessage = (phoneNumber: string, message: string): Promise<string> => {
  //   const ERROR_MESSAGE = "Erreur, impossible d'envoyer le message " + phoneNumber;
  //   return new Promise((resolve, reject) => {
  //     this.sms.send(phoneNumber, message).then(
  //       () => resolve(),
  //       (e) => {
  //         reject(ERROR_MESSAGE);
  //       },
  //     );
  //   });
  // };

  sendMessage = (phoneNumber: string, message: string): void => {
    const ERROR_MESSAGE = "Erreur, impossible d'envoyer le message " + phoneNumber;
    //CONFIGURATION
    const options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: '', // send SMS without opening any other app
      },
    };
    phoneNumber = phoneNumber.split(' ').join('');
    this.sms.send(phoneNumber, message, options).catch((e) => {
      console.error(ERROR_MESSAGE);
    });
  };
}
