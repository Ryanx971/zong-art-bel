import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CalendarService } from '../../services/calendar/calendar.service';
import { ToastService } from '../../services/toast/toast.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-rdv-add',
  templateUrl: './rdv-add.page.html',
  styleUrls: ['./rdv-add.page.scss'],
})
export class RdvAddPage implements OnInit {
  rdvForm: FormGroup;
  submitAttempt = false;
  title = 'Rendez-vous';
  cliente: string;
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
    this.cliente = '';
    this.rdvForm = this.formBuilder.group({
      cliente: ['', Validators.compose([Validators.required])],
      prestation: [''],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      duree: ['', Validators.required],
      prix: [''],
      frequence: ['aucune', Validators.required],
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.nativeStorage.getItem('services').then(
      data => {
        this.services = data;
      },
      e => console.error('Error get services', e),
    );
  }

  setRdv(): void {
    if (this.rdvForm.valid) {
      // Récupération des informations des formulaires
      let cliente = this.rdvForm.controls['cliente'].value;
      let prixPrestation = JSON.parse(this.rdvForm.controls['prestation'].value);
      let date = this.rdvForm.controls['date'].value;
      let heureDebut = this.rdvForm.controls['heureDebut'].value;
      let duree = this.rdvForm.controls['duree'].value;
      let frequence = this.rdvForm.controls['frequence'].value;
      let prestation = prixPrestation.name;
      let prix = prixPrestation.price;

      // Majuscule de la cliente
      cliente = cliente.charAt(0).toUpperCase() + cliente.slice(1);

      // Sauvegarde du nom de la cliente
      this.saveCustomer(cliente);

      let dateDebut = new Date(date + 'T' + heureDebut);
      // Transformation de la duree en minute
      let minutes = +duree.substring(0, 2) * 60 + +duree.substring(3, 5);
      let dateFin = new Date(dateDebut.getTime() + minutes * 60000);

      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.rdvForm.controls['prix'].value.trim().length != 0) prix = this.rdvForm.controls['prix'].value;

      let titre = cliente + ' - ' + prestation + ', ' + prix;

      this.calendar.createEvent(titre, prix, dateDebut, dateFin, frequence).then(
        () => {
          this.dialogs
            .confirm('Voulez-vous envoyer le rendez-vous sous forme de message ?', 'Rendez-vous', ['Oui', 'Non'])
            .then(buttonIndex => {
              if (buttonIndex === 1) {
                let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                let msg =
                  'Bonjour ' +
                  cliente +
                  ',\nVotre prochain rendez-vous est le ' +
                  dateDebut.toLocaleString('fr-FR', options) +
                  ' à ' +
                  heureDebut +
                  '.\nPour un/une ' +
                  prestation +
                  ', le prix sera de ' +
                  prix +
                  '€\n À bientôt';
                this.socialSharing.share(msg, 'Rendez-vous', null, null);
              }
              this.toast.show('Rendez-vous ajouté avec succès', 'success-toast', 'bottom', 4000);
              this.rdvForm.reset();
              this.rdvForm.controls['prix'].setValue('');
              this.rdvForm.controls['frequence'].setValue('aucune');
            });
          this.toast.show('Rendez-vous ajouté avec succès', 'success-toast', 'bottom', 4000);
          this.rdvForm.reset();
          this.rdvForm.controls['prix'].setValue('');
          this.rdvForm.controls['frequence'].setValue('aucune');
        },
        e => {
          alert('Une erreur est survenue');
          console.error(e);
        },
      );
    }
  }

  onSelectChange(event): void {
    let service = JSON.parse(event.detail.value);
    this.rdvForm.controls['duree'].setValue(service.duration);
  }

  getItems() {
    var q = this.cliente;
    // if the value is an empty string don't filter the items
    if (q.trim() == '') return;

    this.nativeStorage.getItem('customers').then(
      data => {
        this.customers = data.filter(v => {
          if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) return true;
          return false;
        });
      },
      e => {
        console.error('Error get customers list' + e);
      },
    );
  }

  itemListClick(item: string): void {
    this.cliente = item;
    this.rdvForm.controls['cliente'].setValue(item);
    this.customers = [];
  }

  saveCustomer(nom: string): void {
    this.nativeStorage.getItem('customers').then(
      data => {
        var exist = false;
        data.forEach(item => {
          if (item == nom) exist = true;
        });

        // Si le nom n'existe pas on l'ajoute
        if (!exist) {
          data.push(nom);
          this.nativeStorage.setItem('customers', data).catch(e => {
            console.error('Error storing customer', e);
          });
        }
      },
      e => {
        console.error('Error get list of customers ', e);
      },
    );
  }
}
