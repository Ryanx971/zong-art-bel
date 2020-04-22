import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastService } from '../../../services/toast/toast.service';
import { SERVICES } from '../../../settings';
import { STORAGE_SERVICES } from 'src/app/constants/app.constant';

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
    private toastService: ToastService,
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
            this.nativeStorage.setItem('services', SERVICES).then(
              () => {
                let popover: PopoverController = this.navParam.get('popover');
                popover.dismiss();
                this.toastService.show(
                  'Mise en place des valeurs par défaut terminée.',
                  'success-toast',
                  'bottom',
                  4000,
                );
              },
              (e) => {
                console.error(ERROR_MESSAGE, e);
                this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
              },
            );
          }
        },
        (e) => console.error('Erreur, impossible de montrer la modale de dialogue [Dialogs Plugin].', e),
      );
  }

  deleteAll = () => {
    const ERROR_MESSAGE = 'Erreur, impossible de supprimer tous les prestations';
    this.dialogs
      .confirm(
        "Êtes-vous sûr de vouloir supprimer l'ensemble des prestations ?", // message
        'Confirmation', // title
        ['Non', 'Oui, je suis sûr'], // buttonLabels
      )
      .then(
        (choice: number) => {
          if (choice === 2) {
            this.nativeStorage.setItem(STORAGE_SERVICES, []).then(
              () => {
                let popover: PopoverController = this.navParam.get('popover');
                popover.dismiss();
                this.toastService.show('Suppression terminée.', 'success-toast', 'bottom', 4000);
              },
              (e) => {
                console.error(ERROR_MESSAGE, e);
                this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 4000);
              },
            );
          }
        },
        (e) => console.error('Erreur, impossible de montrer la modale de dialogue [Dialogs Plugin].', e),
      );
  };
}
