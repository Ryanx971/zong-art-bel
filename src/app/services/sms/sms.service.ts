import { Injectable } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  constructor(private sms: SMS) {}

  sendMessage = (phoneNumber: string, message: string): Promise<any> => {
    const ERROR_MESSAGE = "Erreur, impossible d'envoyer le message " + phoneNumber;
    //CONFIGURATION
    const options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: '', // send SMS without opening any other app
      },
    };
    phoneNumber = phoneNumber.split(' ').join('');
    return new Promise((resolve, reject) => {
      this.sms.send(phoneNumber, message, options).then(
        () => resolve(),
        (e: any) => {
          reject();
          console.error(ERROR_MESSAGE, e);
        },
      );
    });
  };
}
