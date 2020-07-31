import { Injectable } from '@angular/core';
import { Contact, ContactFieldType, Contacts, IContactFindOptions } from '@ionic-native/contacts/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Customer } from 'src/app/models';
import { removeDuplicate, text } from 'src/app/utils';
import { STORAGE_CUSTOMERS } from '../../constants/app.constant';

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
          console.error(text('errorContactSFind') + ' [Get All Contact]', e);
          reject(text('errorContactSFind'));
        },
      );
    });
  };

  synchronize = (): Promise<string> => {
    const ERROR_MESSAGE = text('syncErrorMessage');
    const SUCCESS_MESSAGE = text('syncSuccessMessage');
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
              isSync: true,
            };
          });
          this.nativeStorage.getItem(STORAGE_CUSTOMERS).then(
            (storage) => {
              // Suppression des doublons
              const result: Customer[] = removeDuplicate(customers.concat(storage));
              this.nativeStorage.setItem(STORAGE_CUSTOMERS, result).then(
                () => resolve(SUCCESS_MESSAGE),
                (e) => {
                  console.error(text('errorNSSetCustomers'), e);
                  reject(ERROR_MESSAGE);
                },
              );
            },
            (e) => {
              console.error(text('errorNSGetCustomers'), e);
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
