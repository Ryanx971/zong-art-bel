import { Component } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Dialogs } from '@ionic-native/dialogs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';

@IonicPage()
@Component({
  selector: 'page-rdv',
  templateUrl: 'rdv.html',
})
export class RdvPage {

  titre: string = "Prise de rendez-vous";
  rdvForm: FormGroup;
  // searchQuery: string = '';
  // items: string[];

  constructor(
    public dialogs: Dialogs,
    public toastCtrl: ToastController,
    navCtrl: NavController,
    private formBuilder: FormBuilder,
    public socialSharing: SocialSharing,
    private nativeStorage: NativeStorage,
    private calendar: Calendar
  ) {
    // this.initializeItems();
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
  }

  // initializeItems() {
  //   this.nativeStorage.getItem('cliente_liste').then(data=>
  //   {
  //     // this.items = JSON.parse(data);
  //     console.log(JSON.stringify(data ));
  //     return true;
  //   },
  //   e=>
  //   {
  //     console.log("Cliente_liste don't exist");
  //     return false;
  //   });
  // }

  // getItems(ev: any)
  // {
  //   // Reset items back to all of the items
  //   if(this.initializeItems())
  //   {
  //     // set val to the value of the searchbar
  //     const val = ev.target.value;
  //     // if the value is an empty string don't filter the items
  //     if (val && val.trim() != '')
  //     {
  //       this.items = this.items.filter((item) =>
  //       {
  //         return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //       })
  //     }
  //   }
  // }

  onChange(select: string)
  {
    if(select == "Pose capsules,25")
      this.rdvForm.controls['duree'].setValue("3:00");
    if(select == "Pose capsules & vernis semi-permanent pieds,32")
      this.rdvForm.controls['duree'].setValue("14:00");
    if(select == "Pose chablon,30")
      this.rdvForm.controls['duree'].setValue("3:00");
    if(select == "Pose chablon & vernis semi-permanent pieds,37")
      this.rdvForm.controls['duree'].setValue("14:00");
    if(select == "Remplissage,15")
      this.rdvForm.controls['duree'].setValue("3:00");
    if(select == "Gainage,15")
      this.rdvForm.controls['duree'].setValue("14:00");
    if(select == "Vernis semi-permanent - mains,12")
      this.rdvForm.controls['duree'].setValue("3:00");
    if(select == "Vernis semi-permanent - pieds,7")
      this.rdvForm.controls['duree'].setValue("14:00");
    if(select == "Vernis semi-permanent - mains & pieds,15")
      this.rdvForm.controls['duree'].setValue("3:00");
    if(select == "Remplissage mains & vernis semi-permanent pieds,20")
      this.rdvForm.controls['duree'].setValue("14:00");
    if(select == "Dépose,10")
      this.rdvForm.controls['duree'].setValue("3:00");
  }

  // Création d'un RDV
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

      let dateDebut = new Date(date+"T"+heureDebut);
      // Transformation de la duree en minute
      var minutes =(+duree.substring(0,2)*60) + +duree.substring(3,5);
      let dateFin = new Date(dateDebut.getTime()+minutes*60000);

      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.rdvForm.controls['prix'].value != "")
      {
        prixPrestation[1] = this.rdvForm.controls['prix'].value;
      }
      if(frequence != "aucune")
      {
        var calOptions = this.calendar.getCalendarOptions();
        calOptions.recurrence = "weekly";
        calOptions.recurrenceInterval = +frequence;
        this.calendar.createEventWithOptions(prixPrestation[0]+" - "+cliente+", "+prixPrestation[1],"Zong Art Bel",prixPrestation[1]+"€",dateDebut,dateFin,calOptions);
      }
      else
      {
        this.calendar.createEvent(prixPrestation[0]+" - "+cliente+", "+prixPrestation[1],"Zong Art Bel",prixPrestation[1]+"€",dateDebut,dateFin);
      }
      // this.saveCliente(cliente.toLowerCase());
      this.dialogs.confirm("Voulez-vous envoyer le rendez-vous sous forme de message ?",
      "Rendez-vous",
      ["Oui", "Non"]).then(buttonIndex=>{
        if(buttonIndex==1)
        {
          var msg = "Bonjour "+cliente+",\nVotre prochain rendez-vous est le "+date+" à "+heureDebut+".\nPour un/une "+prixPrestation[0]+", le prix sera de "+prixPrestation[1]+"€\n À bientôt";
          this.socialSharing.share(msg,"Rendez-vous",null,null);
        }
        let toast = this.toastCtrl.create(
          {
            message: "Rendez-vous ajouté avec succès",
            duration: 2000
          });
          toast.present();
          this.rdvForm.reset();
      });
    }
  }

  // saveCliente(cliente: string)
  // {
  //   this.nativeStorage.getItem('cliente_liste').then(data=>
  //   {
  //     console.log(JSON.stringify(data));
  //     var dataArray: string[] = [];
  //     dataArray = data;
  //     console.log(dataArray);
  //     if(dataArray.indexOf(cliente) != -1)
  //     {
  //       console.log("La cliente est déjà enregistrée");
  //     }
  //     else
  //     {
  //       console.log("La cliente n'est pas encore enregistrée, enregistrement en cours ...");
  //       dataArray.push(cliente);
  //       // this.nativeStorage.setItem('cliente_liste',dataArray);
  //     }
  //
  //   },
  //   e=>
  //   {
  //     this.nativeStorage.setItem('cliente_liste',cliente);
  //     console.log("La liste n'existe pas, création en cours");
  //   });
  // }
}
