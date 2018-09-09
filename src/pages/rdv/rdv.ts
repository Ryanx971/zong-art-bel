import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-rdv',
  templateUrl: 'rdv.html',
})
export class RdvPage {

  private prestation : string = "";
  private date : string = "";
  private heureDebut : string ="";
  private duree : string = "02:00";
  private searchBar : string = "";
  // SearchBar
  // private clientes : any=[];
  // Auto
  private autocompleteCliente : string = "";
  // Uniquement si on souhaite faire une "Remise"
  private prixSpec : number;
  // Visibilité de l'input de fréquence
  private visibleFrequence = false;
  // fréquence en semaine
  private frequence : number = 3;

  constructor(
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private calendar: Calendar
  ) {
  }

  ionViewDidLoad() {
    console.log('Ouverture de la page afin de prendre un rdv');
  }

  // Création d'un RDV
  public setRdv():void
  {
    if(this.verification())
    {
      // Récupération du prix et de la Prestation
      var prestaPrix= this.prestation.split(",");
      // Si l'utilisateur a mit un prix special il remplace l'ancien prix
      if (this.prixSpec!=null)
        prestaPrix[1]=String(this.prixSpec);
      // Ajout de l'evenement dans le calendrier
      // Recuperation de la date du debut
      let dateDebut = new Date(this.date+"T"+this.heureDebut);
      // Transformation de la duree en minute
      var minutes =(+this.duree.substring(0,2)*60) + +this.duree.substring(3,5);
      let dateFin = new Date(dateDebut.getTime()+minutes*60000);
      if(this.visibleFrequence==true)
      {
        // Recuperation des options
        var calOptions = this.calendar.getCalendarOptions();
        calOptions.recurrence = "weekly";
        calOptions.recurrenceInterval = this.frequence;
        this.calendar.createEventWithOptions(prestaPrix[0]+" - "+this.searchBar,prestaPrix[1],'Zong Art Bel',dateDebut,dateFin,calOptions);
      }
      else
      {
        // Sans option
        this.calendar.createEvent(prestaPrix[0]+" - "+this.autocompleteCliente,prestaPrix[1],'Zong Art Bel',dateDebut,dateFin);
      }
      console.log("Rdv ajouté, le "+dateDebut);
      this.showAlert();
      // On vide les champs
      this.date="";
      this.duree="";
      this.prixSpec=null;
      this.autocompleteCliente="";

      // Toast de confirmation
      let toast = this.toastCtrl.create(
        {
          message: "Rdv ajouté avec succès",
          duration: 2000
        });
        toast.present();

    }
    else
    {
      console.log("Erreur de saisie");
    }
  }


  // Recuperation de toutes les clientes de la base
  /*public getAllCustomer():void
  {
    var selectClientes = "SELECT nom,prenom FROM customer;";
    // Ouverture de la BDD
    this.sqlite.create({
      name: 'Ongle.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql(selectClientes,[])
        .then((resultat) =>
        {
          console.log("Chargement des clientes de la base.");
          for(var i = 0; i<resultat.rows.length; i++)
          {
            if(this.clientes.indexOf(resultat.rows.item(i).nom+" "+resultat.rows.item(i).prenom)==-1)
            {
                this.clientes.push(resultat.rows.item(i).nom+" "+resultat.rows.item(i).prenom);
            }
          }
        })
        .catch(error => console.log("Erreur Selection clientes",error));
      })
      .catch(error => console.log("Db error",error));
  }*/


  /*public getItems(ev: any)
  {
    // Initialisation
    this.getAllCustomer();
    // Set val to the value of the searchbar
    let val = ev.target.value;
    // If the value is an empty string don't filter the items
    if (val && val.trim() != '')
    {
      this.clientes = this.clientes.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }*/

  // Verification des saisies
  public verification():boolean
  {
    var champs = "";
    if(this.visibleFrequence == true)
    {
      if (String(this.frequence)=="")
        champs+="Fréquence ";
    }
    if (this.prestation=="")
      champs+="Prestation ";
    if (this.date=="")
      champs+="Date ";
    if (this.heureDebut=="")
      champs+="Heure du debut "
    if(this.duree=="")
      champs+="Duree ";
    if (this.autocompleteCliente=="")
      champs+="Cliente ";
    if(champs=="")
    {
      return true;
    }
    else
    {
      // Toast affichant les champs manquants
      let toast = this.toastCtrl.create(
        {
          message: 'Erreur, veuillez remplir : '+champs.replace(/\s/gi,",")+".",
          duration: 4000
        });
        toast.present();
      return false;
    }
  }

  // Lors d'un click on remplace directement la cliente trouvée
  // public updateSearchBar(event,cliente):void
  // {
  //   event.stopPropagation();
  //   this.searchBar = cliente;
  // }


  // Toggle recursive
  public changeToggle() : void
  {
    this.visibleFrequence = !this.visibleFrequence;
  }

  public showAlert(){
    const alert = this.alertCtrl.create({
      title: 'Message',
      subTitle: 'Voulez-vous envoyer le rendez-vou sous forme de message ?',
      buttons: [
        {
          text:'Oui',
          handler:data=>{
            // Envoie du msg
            var msg = "Bonjour, "+this.autocompleteCliente+"\n Votre prochain rendez-vous est le "+this.date+" à "+this.heureDebut+".\n a la prochaine.";
            this.socialSharing.share(msg,"Rendez-vous");
          }
        },
        {
          text:"Non"
        }]
    });
    alert.present();
  }
}
