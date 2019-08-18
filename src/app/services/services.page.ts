/**
 * @Author: Ryan BALOJI <ryanx971>
 * @Date:   2019-08-15T18:34:48+02:00
 * @Email:  ryan.baloji9@gmail.com
 * @Last modified by:   ryanx971
 * @Last modified time: 2019-08-18T13:42:26+02:00
 */



import { Component, OnInit } from '@angular/core';
import { LoadDefaultComponent } from '../components/load-default/load-default.component';

import { AlertController, PopoverController } from '@ionic/angular';

import { ToastService } from '../toast.service';

import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  title: string = "Mes prestations";
  services = [];

  constructor(
    private nativeStorage: NativeStorage,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private toast: ToastService
  ) { }

  ngOnInit() {
  }

  loadServices(): void {
    this.nativeStorage.getItem("services").then(data => {
      this.services = data;
    }, e => console.error("Error get services", e));
  }

  ionViewWillEnter(){
    this.loadServices();
  }

  async manage(service = null){
    let name = null;
    let price = null;
    let duration = "02:00";
    let title = "Ajout";
    let add = true;
    if(service != null) {
      name = service.name;
      price = service.price;
      duration = service.duration;
      title = "Modification";
      add = false;
    }

    const alert = await this.alertController.create({
      header: title,
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: name,
          placeholder: 'Nom'
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          value: price,
          placeholder: 'Prix'
        },
        {
          name: 'duration',
          value: duration,
          type: 'time',
        }
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
            if(!data.name.trim())
              errors.push("Le nom est vide");
            if(!data.duration)
              errors.push("La durée est vide");
            if(data.price) {
              if(data.price <= 0)
                errors.push("Le prix doit être positif");
            }
            else {
              errors.push("Le prix est vide");
            }
            if(errors.length === 0) {
              let res = {name: data.name, price: data.price, duration: data.duration}
              // ADD
              if(add)
                this.services.push(res);

              // UPDATE
              if(!add) {
                let index = this.services.indexOf(service);
                console.log(index);
                if(index != 1) {
                  this.services[index] = res;
                  this.toast.show("Modification effectuée avec succès.", "success-toast", "bottom", 4000);
                }
              }
              this.nativeStorage.setItem("services", this.services);
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


  async remove(item: any) {
    let msg = "Êtes-vous sûr de vouloir supprimer la prestation <br><br> <strong> - Nom : " + item.name + " <br> - Prix : " + item.price+ "€ <br> - Durée : " + item.duration + "</strong>";
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
            let index = this.services.indexOf(item);
            if(index != -1) {
              this.services.splice(index, 1);
              this.nativeStorage.setItem("services", this.services);
              this.toast.show("Suppression effectuée avec succès", "success-toast", "bottom", 4000);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async getPopover(event: any) {
    const popover = await this.popoverController.create({
      component: LoadDefaultComponent,
      event: event,
      animated: true,
      showBackdrop: true,
      translucent: true
    });
    await popover.present();
    popover.onDidDismiss().then(() => {
      this.loadServices();
    });
    return;
  }

}
