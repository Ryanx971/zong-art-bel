import { Service } from './models/Service';

// Default values
export const SERVICES: Service[] = [
  { name: 'Pose capsules', price: 25, duration: '02:00' },
  { name: 'Pose capsules & vernis semi-permanent pieds', price: 35, duration: '02:15' },
  { name: 'Pose chablon', price: 30, duration: '02:00' },
  { name: 'Pose chablon & vernis semi-permanent pieds', price: 40, duration: '02:15' },
  { name: 'Remplissage', price: 20, duration: '01:30' },
  { name: 'Gainage', price: 20, duration: '01:30' },
  { name: 'VSP - mains', price: 15, duration: '01:00' },
  { name: 'VSP - pieds', price: 10, duration: '00:30' },
  { name: 'VSP - mains & pieds', price: 20, duration: '01:30' },
  { name: 'Remplissage mains & VSP pieds', price: 25, duration: '01:45' },
  { name: 'Dépose mains', price: 10, duration: '00:15' },
  { name: 'Dépose pieds', price: 5, duration: '00:10' },
  { name: 'Remplissage mains & 1ère pose VSP pieds', price: 30, duration: '01:45' },
  { name: 'Remplissage + de 3 ongles cassés', price: 25, duration: '01:30' },
];
export const DEFAULT_SYNC_KEY: string = 'Zong Art Bel';
export const DEFAULT_MESSAGE_TIME: string = '10:30';
export const DEFAULT_MESSAGE_TEXT: string = '';
export const DEFAULT_MESSAGE_ENABLED: boolean = true;
