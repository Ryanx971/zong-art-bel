import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, PopoverController } from '@ionic/angular';
import { Service } from 'src/app/models';
import { text, ToastColor, ToastPosition } from 'src/app/utils';
import { LoadDefaultComponent } from '../../components/service/load-default/load-default.component';
import { STORAGE_SERVICES } from '../../constants';
import { ToastService } from '../../services/toast/toast.service';

interface ServiceValue {
  name: string;
  price: number;
  duration: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage {
  title = text('servicePageTitle');
  services: Service[] = [];

  constructor(
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private toastService: ToastService,
  ) {}

  /**
   * Récupération des prestations dans le localStorage
   */
  loadServices(): void {
    this.nativeStorage.getItem(STORAGE_SERVICES).then(
      (data: Service[]) => {
        this.services = data;
      },
      (e) => {
        console.error(text('errorNSGetServices'), e);
        this.toastService.show(text('errorNSGetServices'), ToastColor.ERROR, ToastPosition.BOTTOM, 5000);
      },
    );
  }

  ionViewWillEnter() {
    this.loadServices();
  }

  /**
   * Ajoute ou met à jour la prestation
   * @param service Serive à modifier/créer
   * @param index Position
   */
  async manage(service: Service = null, index: number = -1) {
    const ERROR_MESSAGE = text('serviceAlertError');
    let SUCCESS_MESSAGE = text('serviceAlertSuccessAdd');
    let name = null;
    let price = null;
    let duration = '02:00';
    let title = text('serviceAlertTitleAdd');
    // Mode
    let add = true;

    if (service != null) {
      name = service.name;
      price = service.price;
      duration = service.duration;
      title = text('serviceAlertTitleUpdate');
      SUCCESS_MESSAGE = text('serviceAlertSuccessUpdate');
      add = false;
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: name,
          placeholder: 'Nom',
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          value: price,
          placeholder: 'Prix',
        },
        {
          name: 'duration',
          value: duration,
          type: 'time',
        },
      ],
      buttons: [
        {
          text: text('cancel'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Enregistrer',
          handler: (data: ServiceValue) => {
            const errors: string[] = [];
            if (!data.name.trim()) {
              errors.push(text('serviceAlertErrorNameEmpty'));
            }
            if (!data.duration) {
              errors.push(text('serviceAlertErrorDurationEmpty'));
            }
            if (data.price) {
              if (data.price <= 0) {
                errors.push(text('serviceAlertErrorPriceSize'));
              }
            } else {
              errors.push(text('serviceAlertErrorPriceEmpty'));
            }

            if (errors.length === 0) {
              const result: Service = { name: data.name, price: +data.price, duration: data.duration };
              // Ajout
              if (add) {
                this.services.push(result);
              } else {
                // Mise à jour
                this.services[index] = result;
              }

              this.nativeStorage.setItem(STORAGE_SERVICES, this.services).then(
                () => this.toastService.show(SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000),
                (e) => {
                  this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 5000);
                },
              );
              return true;
            }
            let msg = 'Erreur, veuillez vérifier : \n';
            errors.forEach((e) => {
              msg += e + '\n';
            });
            this.toastService.show(msg, ToastColor.ERROR, ToastPosition.BOTTOM, 5000);
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Supprimer une prestation
   * @param item Service à supprimer
   * @param index Position
   */
  async remove(item: Service, index: number) {
    const ERROR_MESSAGE = text('serviceAlertRemoveError');

    const msg =
      'Êtes-vous sûr de vouloir supprimer la prestation <br><br> <strong> - Nom : ' +
      item.name +
      ' <br> - Prix : ' +
      item.price +
      '€ <br> - Durée : ' +
      item.duration +
      '</strong>';
    const alert = await this.alertController.create({
      header: text('serviceAlertRemoveHeader'),
      message: msg,
      buttons: [
        {
          text: text('cancel'),
          role: 'cancel',
        },
        {
          text: text('supp'),
          handler: () => {
            this.services.splice(index, 1);
            this.nativeStorage.setItem(STORAGE_SERVICES, this.services).then(
              () =>
                this.toastService.show(
                  text('serviceAlertRemoveSuccess'),
                  ToastColor.SUCCESS,
                  ToastPosition.BOTTOM,
                  4000,
                ),
              (e) => {
                console.error(ERROR_MESSAGE, e);
                this.toastService.show(ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.BOTTOM, 5000);
              },
            );
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Ouverture du popover (Remise des informations par défaut)
   */
  async getPopover(event: any) {
    let popover = null;
    popover = await this.popoverController.create({
      component: LoadDefaultComponent,
      event,
      animated: true,
      translucent: true,
      componentProps: [{ popover: popover }],
    });
    await popover.present();
    popover.onDidDismiss().then(() => {
      this.loadServices();
    });
    return;
  }
}
