import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastService } from '../../services/toast/toast.service';
import { SERVICES } from '../../settings';

@Component({
  selector: 'app-load-default',
  templateUrl: './load-default.component.html',
  styleUrls: ['./load-default.component.scss'],
})
export class LoadDefaultComponent implements OnInit {
  constructor(private dialogs: Dialogs, private nativeStorage: NativeStorage, private toast: ToastService) {}

  ngOnInit() {}

  setDefault(): void {
    this.dialogs
      .confirm(
        'Êtes-vous sûr de vouloir remettre les valeurs par défaut ?', // message
        'Confirmation', // title
        ['Non', 'Oui, je suis sûr'], // buttonLabels
      )
      .then(
        (choice: number) => {
          if (choice === 2) {
            this.nativeStorage.setItem('services', SERVICES);
            this.toast.show('Mise en place des valeurs par défaut terminée.', 'success-toast', 'bottom', 4000);
          }
        },
        e => console.error('Erreur, impossible de montrer la modale de dialogue [Dialogs Plugin].', e),
      );
  }
}
