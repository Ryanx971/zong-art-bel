import { Component } from '@angular/core';
import { LoadDefaultComponent } from '../../components/service/load-default/load-default.component';
import { AlertController, PopoverController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Service } from 'src/app/models/Service';
import { STORAGE_SERVICES } from '../../constants/app.constant';

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
  title = 'Mes prestations';
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
    const ERROR_MESSAGE = 'Erreur, impossible de récupérer les presations';
    this.nativeStorage.getItem(STORAGE_SERVICES).then(
      (data: Service[]) => {
        this.services = data;
      },
      (e) => this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 5000),
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
    const ERROR_MESSAGE = "Erreur, impossible d'ajouter le client";
    let SUCCESS_MESSAGE = 'Ajout effectué avec succès.';
    let name = null;
    let price = null;
    let duration = '02:00';
    let title = 'Ajout';
    // Mode
    let add = true;

    if (service != null) {
      name = service.name;
      price = service.price;
      duration = service.duration;
      title = 'Modification';
      SUCCESS_MESSAGE = 'Mise à jour effectuée avec succès';
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
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Enregistrer',
          handler: (data: ServiceValue) => {
            const errors: string[] = [];
            if (!data.name.trim()) {
              errors.push('Le nom est vide');
            }
            if (!data.duration) {
              errors.push('La durée est vide');
            }
            if (data.price) {
              if (data.price <= 0) {
                errors.push('Le prix doit être positif');
              }
            } else {
              errors.push('Le prix est vide');
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
            this.toastService.show(msg, 'danger-toast', 'bottom', 5000);
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
    const ERROR_MESSAGE = "Erreur, impossible d'ajouter le client";
    const msg =
      'Êtes-vous sûr de vouloir supprimer la prestation <br><br> <strong> - Nom : ' +
      item.name +
      ' <br> - Prix : ' +
      item.price +
      '€ <br> - Durée : ' +
      item.duration +
      '</strong>';
    const alert = await this.alertController.create({
      header: 'Suppression!',
      message: msg,
      buttons: [
        {
          text: 'Annuller',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.services.splice(index, 1);
            this.nativeStorage.setItem('services', this.services).then(
              () => this.toastService.show('Suppression effectuée avec succès', 'success-toast', 'bottom', 4000),
              (e) => {
                this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 5000);
                console.error('Error in setItem', e);
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
