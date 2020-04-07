import { Injectable } from '@angular/core';
import { Contacts, Contact, IContactFindOptions, ContactFieldType } from '@ionic-native/contacts/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { STORAGE_CUSTOMERS, STORAGE_SERVICES } from '../../constants/app.constant';
import { Customer } from 'src/app/models/Customer';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private contact: Contacts, private nativeStorage: NativeStorage) {}

  private getAll = (): Promise<Contact[] | string> => {
    const desiredFields: ContactFieldType[] = ['displayName', 'phoneNumbers', 'note'];
    const options: IContactFindOptions = {
      filter: '',
      multiple: true,
      desiredFields,
      hasPhoneNumber: true,
    };
    return new Promise((resolve, reject) => {
      this.contact.find(['*'], options).then(
        (contacts: Contact[]) => {
          resolve(contacts.filter((c: Contact) => c.note === 'Zong Art Bel'));
        },
        (e) => {
          console.error("Erreur, impossible d'obtenir les contacts [Get All Contact]", e);
          reject("Erreur, impossible d'obtenir les contacts [Get All Contact]");
        },
      );
    });
  };

  synchronize = (): Promise<string> => {
    const ERROR_MESSAGE = 'Erreur durant la synchronisation';
    return new Promise((resolve, reject) => {
      this.getAll().then(
        (data: Contact[]) => {
          const customers: Customer[] = data.map((c: Contact) => {
            return {
              id: c.id,
              displayName: c.displayName,
              phoneNumbers: c.phoneNumbers,
              note: c.note,
              rawId: c['rawId'],
            };
          });
          this.nativeStorage.setItem(STORAGE_CUSTOMERS, customers).then(
            () => resolve(),
            (e) => {
              console.error('Error in SET ITEM', e);
              reject(ERROR_MESSAGE);
            },
          );
        },
        (e) => {
          reject(ERROR_MESSAGE);
        },
      );
    });
  };
}
