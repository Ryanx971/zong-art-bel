import { COMPANY_NAME } from '../settings';

const texts = {
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
};

export const text = (key: keyof typeof texts): string => {
  return texts[key];
};
