import { Component } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from '../../models/Customer';
import { STORAGE_CUSTOMERS, SYNC_KEY } from '../../constants/app.constant';
import { IContactField, ContactField } from '@ionic-native/contacts/ngx';
import { PopoverComponent } from '../../components/customer/popover/popover.component';
import { v4 as uuidv4 } from 'uuid';

interface CustomerValue {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage {
  title = 'Mes clientes';
  customers: Customer[] = [];

  constructor(
    private nativeStorage: NativeStorage,
    private toastService: ToastService,
    public alertController: AlertController,
    public popoverCtrl: PopoverController,
  ) {}

  /**
   * Récupération des clients dans le localStorage
   */
  loadCustomers(): void {
    const ERROR_MESSAGE = 'Erreur, impossible de récupérer les clients';
    this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
      (data: Customer[]) => {
        this.customers = data;
      },
      (e) => this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 5000),
    );
  }

  ionViewWillEnter() {
    this.loadCustomers();
  }

  /**
   * Ajoute une cliente dans le localStorage
   * @param customer Cliente à ajouter
   */
  // TODO: la modification n'a pas été géré
  async manage(customer: Customer = null, index: number) {
    let title = "Ajout d'une cliente";
    const ERROR_MESSAGE = "Erreur, impossible d'ajouter le client";
    let SUCCESS_MESSAGE = 'Ajout effectué avec succès.';
    // Mode
    let add = true;
    if (customer != null) {
      title = "Modification d'une cliente";
      SUCCESS_MESSAGE = 'Mise à jour effectuée avec succès';
      add = false;
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: customer ? customer.displayName : '',
          placeholder: 'Prénom de la cliente',
          disabled: customer ? true : false,
        },
        {
          name: 'phone',
          type: 'tel',
          value: customer ? customer.phoneNumbers[0].value : '',
          placeholder: 'Téléphone',
          disabled: customer ? true : false,
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
          handler: (data: CustomerValue) => {
            const errors: string[] = [];

            if (!data.name.trim()) errors.push('Le nom de la cliente est vide');

            if (!this.isPhoneNumber(data.phone.trim())) errors.push('Veuillez saisir un numéro de téléphone valide');
            if (errors.length === 0) {
              const phoneNumbers: IContactField[] = [new ContactField('mobile', data.phone)];
              const id: string = uuidv4();
              const result: Customer = {
                id,
                displayName: data.name.trim(),
                note: SYNC_KEY,
                phoneNumbers,
                rawId: id,
                isSync: false,
              };

              // Ajout
              if (add) {
                this.customers.push(result);
              } else {
                // Mise à jour
                this.customers[index] = result;
              }

              this.nativeStorage.setItem(STORAGE_CUSTOMERS, this.customers).then(
                () => this.toastService.show(SUCCESS_MESSAGE, 'success-toast', 'bottom', 4000),
                (e) => {
                  this.toastService.show(ERROR_MESSAGE, 'danger-toast', 'bottom', 5000);
                },
              );
              return true;
            }

            let msg = 'Erreur : \n';
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

  private isPhoneNumber(phone: string): boolean {
    if (phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) !== null) return true;
    return false;
  }

  /**
   * Suppression d'une cliente
   * @param customer Cliente  a supprimer
   */
  async remove(customer: Customer, index: number) {
    const msg = 'Êtes-vous sûr de vouloir supprimer la cliente <strong>' + customer.displayName + '</strong> ?';
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
            this.customers.splice(index, 1);
            this.nativeStorage.setItem('customers', this.customers);
            this.toastService.show('Suppression effectuée avec succès', 'success-toast', 'bottom', 4000);
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Ouverture du popover
   */
  async getPopover(event: any) {
    let popover = null;
    popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event,
      animated: true,
      showBackdrop: true,
      translucent: true,
      componentProps: [{ popover: popover }],
    });
    await popover.present();
    popover.onDidDismiss().then(() => {
      this.loadCustomers();
    });
    return;
  }
}
