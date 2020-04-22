import { Component } from '@angular/core';
import { NavParams, PopoverController, LoadingController } from '@ionic/angular';
import { ContactService } from 'src/app/services/contact/contact.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_CUSTOMERS } from 'src/app/constants/app.constant';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent {
  constructor(
    private contactSerice: ContactService,
    private toastService: ToastService,
    public navParam: NavParams,
    public loadingCtrl: LoadingController,
    private dialogs: Dialogs,
    private nativeStorage: NativeStorage,
  ) {}

  synchronise = async () => {
    // LOADER
    const loading = await this.loadingCtrl.create({
      message: 'Synchronisation en cours...',
    });
    loading.present();
    let popover: PopoverController = this.navParam.get('popover');
    this.contactSerice
      .synchronize()
      .then(
        (msg: string) => {
          this.toastService.show(msg, 'success-toast', 'bottom', 4000);
          popover.dismiss();
        },
        (e) => this.toastService.show(e, 'danger-toast', 'bottom', 4000),
      )
      .finally(() => loading.dismiss());
  };

  deleteAll = () => {
    const ERROR_MESSAGE = 'Erreur, impossible de supprimer tous les clients';
    this.dialogs
      .confirm(
        "Êtes-vous sûr de vouloir supprimer l'ensemble des clients ?", // message
        'Confirmation', // title
        ['Non', 'Oui, je suis sûr'], // buttonLabels
      )
      .then(
        (choice: number) => {
          if (choice === 2) {
            this.nativeStorage.setItem(STORAGE_CUSTOMERS, []).then(
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
