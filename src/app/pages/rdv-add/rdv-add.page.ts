import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CalendarService } from '../../services/calendar/calendar.service';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Customer } from 'src/app/models/Customer';
import { Service } from 'src/app/models/Service';
import { Appointement } from 'src/app/models/Appointment';

@Component({
  selector: 'app-rdv-add',
  templateUrl: './rdv-add.page.html',
  styleUrls: ['./rdv-add.page.scss'],
})
export class RdvAddPage implements OnInit {
  rdvForm: FormGroup;
  submitAttempt = false;
  title = 'Rendez-vous';
  customer: Customer = { name: '' };
  customerSearch: string;
  service: any;
  customers = [];
  services = [];
  JSON: JSON;

  constructor(
    public formBuilder: FormBuilder,
    private nativeStorage: NativeStorage,
    private socialSharing: SocialSharing,
    private dialogs: Dialogs,
    private calendar: CalendarService,
    private toast: ToastService,
  ) {
    this.JSON = JSON;
    this.rdvForm = this.formBuilder.group({
      customer: ['', Validators.compose([Validators.required])],
      service: [''],
      date: ['', Validators.required],
      startHour: ['', Validators.required],
      duration: ['', Validators.required],
      price: [''],
      frequence: ['aucune', Validators.required],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.nativeStorage.getItem('services').then(
      (data: Service[]) => {
        this.services = data;
      },
      e => console.error('Erreur, impossible de récupérer les services [Get Item Service]', e),
    );
  }

  /***
   * Création d'un rendez-vous
   */
  setRdv(): void {
    if (this.rdvForm.valid) {
      // Récupération des informations des formulaires
      this.customer.name = this.rdvForm.controls.customer.value;
      const priceAndService = JSON.parse(this.rdvForm.controls.service.value);
      const date: string = this.rdvForm.controls.date.value;
      const startHour: string = this.rdvForm.controls.startHour.value;
      const duree: string = this.rdvForm.controls.duration.value;
      const frequence: string = this.rdvForm.controls.frequence.value;
      const service = priceAndService.name;
      let price = priceAndService.price;

      // Majuscule de la cliente
      this.customer.name = this.customer.name.charAt(0).toUpperCase() + this.customer.name.slice(1);

      // Sauvegarde du nom de la cliente
      this.saveCustomer(this.customer);

      const startDate = new Date(date + 'T' + startHour);
      // Transformation de la duree en minute
      const minutes = +duree.substring(0, 2) * 60 + +duree.substring(3, 5);
      const endDate = new Date(startDate.getTime() + minutes * 60000);
      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.rdvForm.controls.price.value) {
        price = this.rdvForm.controls.price.value;
      }

      const title = this.customer.name + ' - ' + service + ', ' + price;

      const rdv: Appointement = { title, price, startDate, endDate, frequence };

      this.calendar.createEvent(rdv.title, rdv.price.toString(), rdv.startDate, rdv.endDate, rdv.frequence).then(
        () => {
          this.dialogs
            .confirm('Voulez-vous envoyer le rendez-vous sous forme de message ?', 'Rendez-vous', ['Oui', 'Non'])
            .then(buttonIndex => {
              if (buttonIndex === 1) {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const msg: string =
                  'Bonjour ' +
                  this.customer.name +
                  ',\nVotre prochain rendez-vous est le ' +
                  startDate.toLocaleString('fr-FR', options) +
                  ' à ' +
                  startHour +
                  '.\nPour un/une ' +
                  service +
                  ', le prix sera de ' +
                  rdv.price +
                  '€\n À bientôt';
                this.socialSharing.share(msg, 'Rendez-vous', null, null);
              }
              this.toast.show('Rendez-vous ajouté avec succès', 'success-toast', 'bottom', 4000);
              this.resetForm();
            });
          this.toast.show('Rendez-vous ajouté avec succès', 'success-toast', 'bottom', 4000);
          this.resetForm();
        },
        e => {
          alert('Une erreur est survenue');
          // tslint:disable-next-line: quotemark
          console.error("Erreur, impossible d'ajouter un événement.", e);
        },
      );
    }
  }

  resetForm(): void {
    this.rdvForm.reset();
    this.rdvForm.controls.price.setValue('');
    this.rdvForm.controls.frequence.setValue('aucune');
  }

  /**
   * Dès que le choix de prestation change, on affecte la durée
   */
  onSelectChange(event): void {
    if (event.detail.value) {
      const service: Service = JSON.parse(event.detail.value);
      this.rdvForm.controls.duration.setValue(service.duration);
    }
  }

  /**
   * Recherche de la cliente
   */
  getItems() {
    const search: string = this.customerSearch;
    if (!search || search.trim() === '') {
      return;
    }

    this.nativeStorage.getItem('customers').then(
      (data: Customer[]) => {
        this.customers = data.filter((v: Customer) => {
          if (v.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
            return true;
          }
          return false;
        });
      },
      e => {
        console.error('Erreur, impossible de récupérer les clientes [Get Item Customer]', e);
      },
    );
  }

  itemListClick(customer: Customer): void {
    this.customer.name = customer.name;
    this.rdvForm.controls.customer.setValue(customer.name);
    this.customers = [];
    this.customerSearch = '';
  }

  /**
   * Sauvegarde la cliente dans le localStorage
   * @param customer Cliente
   */
  saveCustomer(customer: Customer): void {
    this.nativeStorage.getItem('customers').then(
      (data: Customer[]) => {
        let exists = false;
        data.forEach((item: Customer) => {
          if (item.name === customer.name) {
            exists = true;
          }
        });

        // Si la cliente n'existe pas on l'ajoute
        if (!exists) {
          data.push(customer);
          this.nativeStorage.setItem('customers', data).catch(e => {
            console.error('Erreur stockage cliente', e);
          });
        }
      },
      e => {
        console.error('Erreur, impossible de récupérer les clientes [Get Item Customer]', e);
      },
    );
  }
}
