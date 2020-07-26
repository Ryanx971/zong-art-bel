import { COMPANY_NAME } from '../settings';

const texts = {
  // COMMON
  cancel: 'Retour',
  save: 'Enregistrer',
  supp: 'Supprimer',

  // HOME PAGE
  homePageTitle: COMPANY_NAME,
  noAppointmentInProgress: "Aucun rendez-vous aujourd'hui",

  syncAlertHeader: 'Synchronisation des contacts',
  syncAlertMessage:
    "Afin d'envoyer des messages à vos clients la veille des rendez-vous, il serait préférable de synchroniser vos contacts avec l'application. Vous pouvez syncroniser vos contacts dès maintenant ou vous pouvez vous rendre dans <strong>les paramètres</strong>.",
  syncAlertCancelBtn: 'Je le ferais plus tard',
  syncAlertSyncBtn: 'Synchroniser mes contacts',

  calendarAlertHeader: 'Calendrier',
  calendarAlertMessage: 'Veuillez sélectionner le calendrier qui sera utilisé pour enregistrer vos rendez-vous.',
  calendarAlertCancelBtn: 'Je le ferais plus tard',
  calendarAlertOkBtn: 'Choisir mon calendrier',

  // HOME MENU
  menuCalendarTitle: 'Calendrier',
  menuAppointmentTitle: 'Rendez-vous',
  menuStatsTitle: 'Statistiques',
  menuParamTitle: 'Paramètres',

  // CONFIG PAGE
  configPageTitle: 'Paramètres',

  // CONFIG MENU
  configMenuSyncTitle: 'Paramètres de synchronisation',
  configMenuMessageTitle: 'Paramètres des messages',
  configMenuServiceTitle: 'Gestion des prestations',
  configMenuCustomerTitle: 'Gestion des clientes',

  // CUSTOMER PAGE
  customerPageTitle: 'Mes clientes',
  customerAlertTitleAdd: "Ajout d'une cliente",
  customerAlertTitleUpdate: "Modification d'une cliente",
  customerAlertErrorMessage: "Erreur, impossible d'ajouter le client",
  customerAlertSuccessMessageAdd: 'Ajout effectué avec succès.',
  customerAlertSuccessMessageUpdate: 'Mise à jour effectuée avec succès',

  customerAlertErrorNameEmpty: 'Le nom de la cliente est vide',
  customerAlertErrorTelEmpty: 'Veuillez saisir un numéro de téléphone valide',

  // PH for PlaceHolder
  customerAlertInputNamePH: 'Prénom du client',
  customerAlertInputPhonePH: 'Téléphone',

  customerAlertRemoveHeaderTitle: 'Suppression',
  customerAlertRemoveSuccess: 'Suppression effectuée avec succès',

  // MESSAGE PAGE
  messagePageTitle: 'Paramètres des messages',
  messagePageSuccessMessage: 'Modification effectuée avec succès',
  messagePageERRORMessage: "Erreur, impossible d'effectuer la modification, veuillez réesayer",

  // PARAMETER PAGE
  parameterPageTitle: 'Paramètres de synchronisation',
  parameterPageSuccessMessage: 'Modification effectuée avec succès',
  parameterPageErrorMessage: "Erreur, impossible d'effectuer la modification, veuillez réesayer",

  // ERRORS //
  // NATIVE STORAGE
  errorNSGetCustomers: 'Erreur, impossible de récupérer les clients',
  errorNSGetMessageEnabled: "Erreur, impossible de savoir si l'envoi de message est activé",
  errorNSGetMessageTime: "Erreur, impossible de récupérer la date d'envoi des messages",
  errorNSGetMessageText: 'Erreur, impossible de récupérer le message personalisé',
  errorNSGetStorageCalendar: 'Erreur, impossible de récupérer le calendrier sélectionné',
  errorNSGetStorageSyncKey: 'Erreur, impossible de récupérer le mot clé de synchronisation sélectionné',
};

export const text = (key: keyof typeof texts): string => {
  return texts[key];
};
