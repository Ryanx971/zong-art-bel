/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-16T20:35:56+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-18T14:42:49+02:00
 */



import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { ToastService } from '../toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {

  title: string = "Mes clientes";
  customers = [];

  constructor(
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.nativeStorage.getItem("customers").then(data => {
      this.customers = data;
    }, e => console.error("Error get customers", e));
  }

  async manage(customer = null){
    let title = "Ajout";
    let add = true;
    if(customer != null) {
      title = "Modification";
      add = false;
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'customer',
          type: 'text',
          value: customer,
          placeholder: 'Nom de la cliente'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Enregistrer',
          handler: (data) => {
            let errors = [];
            if(!data.customer.trim())
              errors.push("Le nom de la cliente est vide");

            if(errors.length === 0) {
              let res = data.customer;
              // ADD
              if(add)
                this.customers.push(res);

              // UPDATE
              if(!add) {
                let index = this.customers.indexOf(customer);
                if(index != 1) {
                  this.customers[index] = res;
                  this.toast.show("Modification effectuée avec succès.", "success-toast", "bottom", 4000);
                }
              }
              this.nativeStorage.setItem("customers", this.customers);
              return true;
            }
            let msg = "Erreur, veuillez vérifier : \n";
            errors.forEach(e => {
              msg += e + "\n";
            });
            this.toast.show(msg, "danger-toast", "bottom", 5000);
            return false;
          }
        }
      ]
    });
    await alert.present();
  }


  async remove(item) {
    let msg = "Êtes-vous sûr de vouloir supprimer la cliente <strong>" + item + "</strong> ?";
    const alert = await this.alertController.create({
      header: 'Suppression!',
      message: msg,
      buttons: [
        {
          text: 'Annuller',
          role: 'cancel',
        }, {
          text: 'Supprimer',
          handler: () => {
            let index = this.customers.indexOf(item);
            if(index != -1) {
              this.customers.splice(index, 1);
              this.nativeStorage.setItem("customers", this.customers);
              this.toast.show("Suppression effectuée avec succès", "success-toast", "bottom", 4000);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
