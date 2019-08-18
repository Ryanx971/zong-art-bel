/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-18T12:59:10+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-18T13:36:14+02:00
 */



import { Component, OnInit } from '@angular/core';

import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { SERVICES } from '../../settings';

@Component({
  selector: 'app-load-default',
  templateUrl: './load-default.component.html',
  styleUrls: ['./load-default.component.scss'],
})
export class LoadDefaultComponent implements OnInit {

  constructor(
    private dialogs: Dialogs,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {}

  setDefault(): void {
    this.dialogs.confirm(
        'Êtes-vous sûr de vouloir remettre les valeurs par défaut ?', // message
        'Confirmation',           // title
        ['Non', 'Oui, je suis sûr']     // buttonLabels
    ).then(number => {
      if(number === 2) {
        this.nativeStorage.setItem("services", SERVICES);
      }
    }, e => console.error("Error dialogs plugin", e));
  }
}
