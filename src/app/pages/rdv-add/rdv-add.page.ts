import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Appointement, Customer, Service } from 'src/app/models';
import { text, ToastColor, ToastPosition } from 'src/app/utils';
import { STORAGE_CUSTOMERS, STORAGE_SERVICES } from '../../constants';
import { CalendarService } from '../../services/calendar/calendar.service';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-rdv-add',
  templateUrl: './rdv-add.page.html',
  styleUrls: ['./rdv-add.page.scss'],
})
export class RdvAddPage {
  rdvForm: FormGroup;
  submitAttempt: boolean = false;
  title: string = text('rdvPageTitle');
  customer: Customer = null;
  customerSearch: string;
  service: any;
  customers: Customer[] = [];
  services: Service[] = [];
  JSON: JSON;

  constructor(
    public formBuilder: FormBuilder,
    private nativeStorage: NativeStorage,
    private calendarService: CalendarService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.JSON = JSON;
    this.rdvForm = this.formBuilder.group({
      customer: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      service: [''],
      date: ['', Validators.required],
      startHour: ['', Validators.required],
      duration: ['', Validators.required],
      price: [''],
      frequence: ['aucune', Validators.required],
    });
  }

  ionViewWillEnter() {
    this.nativeStorage.getItem(STORAGE_SERVICES).then(
      (data: Service[]) => {
        this.services = data;
      },
      (e) => {
        console.error(text('errorNSGetServices'), e);
        this.toastService.show(text('errorNSGetServices'), ToastColor.ERROR, ToastPosition.BOTTOM, 6000);
      },
    );
  }

  open = (path: string) => {
    this.router.navigate([path]);
  };

  /***
   * Création d'un rendez-vous
   */
  setRdv(): void {
    if (this.rdvForm.valid) {
      // Récupération des informations des formulaires
      const priceAndService = JSON.parse(this.rdvForm.controls.service.value);
      const date: string = this.rdvForm.controls.date.value;
      const startHour: string = this.rdvForm.controls.startHour.value;
      const duree: string = this.rdvForm.controls.duration.value;
      const frequence: string = this.rdvForm.controls.frequence.value;
      const service = priceAndService.name;
      let price = priceAndService.price;

      const startDate = new Date(date + 'T' + startHour);
      // Transformation de la duree en minute
      const minutes = +duree.substring(0, 2) * 60 + +duree.substring(3, 5);
      const endDate = new Date(startDate.getTime() + minutes * 60000);
      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.rdvForm.controls.price.value) {
        price = this.rdvForm.controls.price.value;
      }

      const title = this.customer.displayName + ' |•| ' + service + ' |•| ' + price + ' |•| ' + this.customer.rawId;

      const rdv: Appointement = { title, price, startDate, endDate, frequence };

      this.calendarService.createEvent(rdv.title, rdv.price.toString(), rdv.startDate, rdv.endDate, rdv.frequence).then(
        () => {
          this.toastService.show(text('rdvPageAddSuccess'), ToastColor.SUCCESS, ToastPosition.BOTTOM, 4000);
          this.resetForm();
        },
        (e) => {
          this.toastService.show(text('rdvPageAddError'), ToastColor.SUCCESS, ToastPosition.BOTTOM, 5000);
          console.error(e);
        },
      );
    }
  }

  private resetForm(): void {
    this.rdvForm.reset();
    this.rdvForm.controls.price.setValue('');
    this.rdvForm.controls.frequence.setValue('aucune');
  }

  /**
   * Dès que le choix de prestation change, on affecte la durée
   */
  onSelectChange(event: any): void {
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

    this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
      (data: Customer[]) => {
        this.customers = data.filter((v: Customer) => {
          if (v.displayName.toLowerCase().indexOf(search.toLowerCase()) > -1) {
            return true;
          }
          return false;
        });
      },
      (e) => {
        console.error(text('errorNSGetCustomers'), e);
        this.toastService.show(text('errorNSGetCustomers'), ToastColor.ERROR, ToastPosition.BOTTOM, 6000);
      },
    );
  }

  itemListClick(customer: Customer): void {
    this.customer = customer;
    this.rdvForm.controls.customer.setValue(customer.displayName);
    this.customers = [];
    this.customerSearch = '';
  }
}
