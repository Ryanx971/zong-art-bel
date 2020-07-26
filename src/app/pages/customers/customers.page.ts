import { Component } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from '../../models/Customer';
import { STORAGE_CUSTOMERS, SYNC_KEY } from '../../constants/app.constant';
import { IContactField, ContactField } from '@ionic-native/contacts/ngx';
import { PopoverComponent } from '../../components/customer/popover/popover.component';
import { v4 as uuidv4 } from 'uuid';
import { text } from 'src/app/utils/text';
import { ToastColor, ToastPosition } from 'src/app/utils/enumeration';

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
  title = text('customerPageTitle');
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
    this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
      (data: Customer[]) => {
        this.customers = data;
      },
      (e) => {
        console.error(text('errorNSGetCustomers'), e);
        this.toastService.show(text('errorNSGetCustomers'), ToastColor.ERROR, ToastPosition.bottom, 5000);
      },
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
  async manage(customer: Customer = null, index: number = -1) {
    let title = text('customerAlertTitleAdd');
    const ERROR_MESSAGE = text('customerAlertErrorMessage');
    let SUCCESS_MESSAGE = text('customerAlertSuccessMessageAdd');
    // Mode
    let add = true;
    if (customer != null) {
      title = text('customerAlertTitleUpdate');
      SUCCESS_MESSAGE = text('customerAlertSuccessMessageUpdate');
      add = false;
    }

    // Buttons
    let buttons: [any] = [
      {
        text: text('cancel'),
        role: 'cancel',
        cssClass: 'secondary',
      },
    ];
    if (!customer || !customer.isSync) {
      buttons.push({
        text: text('save'),
        handler: (data: CustomerValue) => {
          const errors: string[] = [];

          if (!data.name.trim()) errors.push(text('customerAlertErrorNameEmpty'));

          if (!this.isPhoneNumber(data.phone.trim())) errors.push(text('customerAlertErrorTelEmpty'));
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
              () => this.toastService.show(SUCCESS_MESSAGE, ToastColor.SUCCESS, ToastPosition.bottom, 4000),
              (e) => {
                console.error(ERROR_MESSAGE, e);
                this.toastService.show(ERROR_MESSAGE, ToastColor.ERROR, ToastPosition.bottom, 5000);
              },
            );
            return true;
          }

          let msg = 'Erreur : \n';
          errors.forEach((e) => {
            msg += e + '\n';
          });
          this.toastService.show(msg, ToastColor.ERROR, ToastPosition.bottom, 5000);
          return false;
        },
      });
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: customer ? customer.displayName : '',
          placeholder: text('customerAlertInputNamePH'),
          disabled: customer && customer.isSync ? true : false,
        },
        {
          name: 'phone',
          type: 'tel',
          value: customer ? customer.phoneNumbers[0].value : '',
          placeholder: text('customerAlertInputPhonePH'),
          disabled: customer && customer.isSync ? true : false,
        },
      ],
      buttons,
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
      header: text('customerAlertRemoveHeaderTitle'),
      message: msg,
      buttons: [
        {
          text: text('cancel'),
          role: 'cancel',
        },
        {
          text: text('supp'),
          handler: () => {
            this.customers.splice(index, 1);
            this.nativeStorage.setItem('customers', this.customers);
            this.toastService.show(text('customerAlertRemoveSuccess'), ToastColor.SUCCESS, ToastPosition.bottom, 4000);
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
