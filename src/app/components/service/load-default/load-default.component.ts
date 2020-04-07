import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastService } from '../../../services/toast/toast.service';
import { SERVICES } from '../../../settings';

@Component({
  selector: 'app-load-default',
  templateUrl: './load-default.component.html',
  styleUrls: ['./load-default.component.scss'],
})
export class LoadDefaultComponent {
  constructor(
    private dialogs: Dialogs,
    public navParam: NavParams,
    private nativeStorage: NativeStorage,
    private toast: ToastService,
  ) {}

  setDefault(): void {
    const ERROR_MESSAGE = 'Erreur, impossible de mettre en place les valeurs par défaut.';
    this.dialogs
      .confirm(
        'Êtes-vous sûr de vouloir remettre les valeurs par défaut ?', // message
        'Confirmation', // title
        ['Non', 'Oui, je suis sûr'], // buttonLabels
      )
      .then(
        (choice: number) => {
          if (choice === 2) {
            this.nativeStorage.setItem('services', SERVICES).then(() => {
              let popover: PopoverController = this.navParam.get('popover');
              popover.dismiss();
              this.toast.show('Mise en place des valeurs par défaut terminée.', 'success-toast', 'bottom', 4000);
            });
          }
        },
        (e) => console.error('Erreur, impossible de montrer la modale de dialogue [Dialogs Plugin].', e),
      );
  }
}
