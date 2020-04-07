import { IContactField } from '@ionic-native/contacts/ngx';

export interface Customer {
  id?: string;
  displayName: string;
  phoneNumbers: IContactField[];
  note: string;
  rawId?: string;
}
