import { Customer } from './models/Customer';
import { Service } from './models/Service';

// Défault values
export const CUSTOMERS: Customer[] = [{ name: 'Angelique' }];
export const SERVICES: Service[] = [
  { name: 'Pose capsules', price: 25, duration: '01:30' },
  { name: 'Pose capsules & vernis semi-permanent pieds', price: 32, duration: '02:00' },
  { name: 'Pose chablon', price: 30, duration: '01:30' },
  { name: 'Pose chablon & vernis semi-permanent pieds', price: 37, duration: '02:00' },
  { name: 'Remplissage', price: 20, duration: '01:30' },
  { name: 'Gainage', price: 15, duration: '01:30' },
  { name: 'Vernis semi-permanent - mains', price: 15, duration: '01:00' },
  { name: 'Vernis semi-permanent - pieds', price: 10, duration: '00:30' },
  { name: 'Vernis semi-permanent - mains & pieds', price: 20, duration: '01:30' },
  { name: 'Remplissage mains & vernis semi-permanent pieds', price: 25, duration: '00:30' },
  { name: 'Dépose', price: 10, duration: '' },
];
