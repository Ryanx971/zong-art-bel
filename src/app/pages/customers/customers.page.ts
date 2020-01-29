import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  title = 'Mes clientes';
  customers: Customer[] = [];

  constructor(
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    private toast: ToastService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.nativeStorage.getItem('customers').then(
      (data: Customer[]) => {
        this.customers = data;
      },
      e => console.error('Erreur, impossible de récupérer les clients [Get Item Customer]', e),
    );
  }

  /**
   * Ajoute une cliente dans le localStorage
   * @param customer Cliente à ajouter
   */
  async manage(customer: Customer = null, index: number) {
    let title = 'Ajout';
    // Mode
    let add = true;
    if (customer != null) {
      title = 'Modification';
      add = false;
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'customer',
          type: 'text',
          value: customer ? customer.name : '',
          placeholder: 'Nom de la cliente',
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
          handler: data => {
            const errors: string[] = [];
            if (!data.customer.trim()) {
              errors.push('Le nom de la cliente est vide');
            }

            if (errors.length === 0) {
              const result: Customer = { name: data.customer };

              // Ajout
              if (add) {
                this.customers.push(result);
              }

              // Mise à jour
              if (!add) {
                this.customers[index] = result;
                this.toast.show('Modification effectuée avec succès.', 'success-toast', 'bottom', 4000);
              }
              this.nativeStorage.setItem('customers', this.customers);
              return true;
            }

            let msg = 'Erreur, veuillez vérifier : \n';
            errors.forEach(e => {
              msg += e + '\n';
            });

            this.toast.show(msg, 'danger-toast', 'bottom', 5000);
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  /**
   * Suppression d'une cliente
   * @param customer Cliente  a supprimer
   */
  async remove(customer: Customer, index: number) {
    const msg = 'Êtes-vous sûr de vouloir supprimer la cliente <strong>' + customer.name + '</strong> ?';
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
            this.toast.show('Suppression effectuée avec succès', 'success-toast', 'bottom', 4000);
          },
        },
      ],
    });
    await alert.present();
  }
}
