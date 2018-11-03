import { Component } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { Toast } from '@ionic-native/toast';

import { CalendarProvider } from '../../providers/calendar/calendar';



@IonicPage()
@Component({
  selector: 'page-rdv',
  templateUrl: 'rdv.html',
})
export class RdvPage {

  titre: string = "Prise de rendez-vous";
  rdvForm: FormGroup;
  cliente: string = "";
  items = [];

  constructor(
    public dialogs: Dialogs,
    public toastCtrl: ToastController,
    navCtrl: NavController,
    private formBuilder: FormBuilder,
    public socialSharing: SocialSharing,
    private calendar: Calendar,
    private nativeStorage: NativeStorage,
    private toast: Toast,
    private calProvider: CalendarProvider
  ) {
    this.cliente = '';
    this.rdvForm = this.formBuilder.group({
      cliente: ['', Validators.required],
      prestation: [''],
      date: ['', Validators.required],
      heureDebut: ['', Validators.required],
      duree: ['', Validators.required],
      prix: [''],
      frequence: ['aucune', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('Ouverture PageRdv');
    this.calProvider.checkCalendar();
  }


  onChange(select: string)
  {
    if(select == "Pose capsules,25")
      this.rdvForm.controls['duree'].setValue("01:30");
    if(select == "Pose capsules & vernis semi-permanent pieds,32")
      this.rdvForm.controls['duree'].setValue("02:00");
    if(select == "Pose chablon,30")
      this.rdvForm.controls['duree'].setValue("01:30");
    if(select == "Pose chablon & vernis semi-permanent pieds,37")
      this.rdvForm.controls['duree'].setValue("02:00");
    if(select == "Remplissage,15")
      this.rdvForm.controls['duree'].setValue("01:30");
    if(select == "Gainage,15")
      this.rdvForm.controls['duree'].setValue("01:30");
    if(select == "Vernis semi-permanent - mains,12")
      this.rdvForm.controls['duree'].setValue("01:00");
    if(select == "Vernis semi-permanent - pieds,7")
      this.rdvForm.controls['duree'].setValue("00:30");
    if(select == "Vernis semi-permanent - mains & pieds,15")
      this.rdvForm.controls['duree'].setValue("01:15");
    if(select == "Remplissage mains & vernis semi-permanent pieds,20")
      this.rdvForm.controls['duree'].setValue("01:30");
    if(select == "Dépose,10")
      this.rdvForm.controls['duree'].setValue("00:30");
  }

  setRdv()
  {
    if(this.rdvForm.valid)
    {
      // Récupération des informations des formulaires
      var cliente = this.rdvForm.controls['cliente'].value;
      var prixPrestation = this.rdvForm.controls['prestation'].value.split(",");
      var date = this.rdvForm.controls['date'].value;
      var heureDebut = this.rdvForm.controls['heureDebut'].value;
      var duree = this.rdvForm.controls['duree'].value;
      var frequence = this.rdvForm.controls['frequence'].value;

      // Sauvegarde du nom de la cliente
      this.saveCliente(cliente.toLowerCase());

      let dateDebut = new Date(date+"T"+heureDebut);
      // Transformation de la duree en minute
      var minutes =(+duree.substring(0,2)*60) + +duree.substring(3,5);
      let dateFin = new Date(dateDebut.getTime()+minutes*60000);

      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.rdvForm.controls['prix'].value != "")
      {
        prixPrestation[1] = this.rdvForm.controls['prix'].value;
      }

      var calOptions = this.calendar.getCalendarOptions();
      calOptions.calendarId = this.calendarId;
      var titre = cliente+" - "+prixPrestation[0]+", "+prixPrestation[1];

      if(frequence != "aucune")
      {
        calOptions.recurrence = "weekly";
        calOptions.recurrenceInterval = +frequence;
        this.calendar.createEventWithOptions(titre,"Zong Art Bel",prixPrestation[1]+" €",dateDebut,dateFin,calOptions);
      }
      else
      {
        console.log(prixPrestation[1]);
        this.calendar.createEventWithOptions(titre,"Zong Art Bel",prixPrestation[1]+" €",dateDebut,dateFin,calOptions);
      }
      this.dialogs.confirm("Voulez-vous envoyer le rendez-vous sous forme de message ?",
      "Rendez-vous",
      ["Oui", "Non"]).then(buttonIndex=>{
        if(buttonIndex==1)
        {
          var msg = "Bonjour "+cliente+",\nVotre prochain rendez-vous est le "+date+" à "+heureDebut+".\nPour un/une "+prixPrestation[0]+", le prix sera de "+prixPrestation[1]+"€\n À bientôt";
          this.socialSharing.share(msg,"Rendez-vous",null,null);
        }
        this.toast.show(`Rendez-vous ajouté avec succès`, '2000', 'bottom').subscribe(toast => {});
        this.rdvForm.reset();
      });
    }
  }

  getItems()
  {
    var q = this.cliente;
    // if the value is an empty string don't filter the items
    if (q.length < 3)
      return;

    this.nativeStorage.getItem('cliente-liste')
    .then(
      data =>{
        this.items = data.filter((v) => {
          if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
          }
          return false;
        })
      },
      error => {
        console.error("Error get cliente-liste "+error);
      });
  }

  itemListClick(item :string)
  {
    this.cliente = item;
    this.items = [];
  }

  saveCliente(nom :string)
  {
    this.nativeStorage.getItem('cliente-liste')
    .then(
      data =>{
        var existe = false;
        data.forEach(item => {
          if(item == nom)
            existe = true;
        });

        // Si le nom n'existe pas on l'ajoute
        if(!existe)
        {
          data.push(nom);
          this.nativeStorage.setItem('cliente-liste',data)
          .then(() => {
            console.log('Stored customer '+nom);
          },
          error => {
            console.error('Error storing item', error);
          });
        }
      },
      error => {
        console.error("Error get cliente-liste "+error);
      });
  }
}
