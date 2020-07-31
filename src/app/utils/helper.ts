import { Customer } from '../models';

export const removeDuplicate = (array: Customer[]) => {
  var a: Customer[] = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i].id === a[j].id) a.splice(j--, 1);
    }
  }

  return a;
};
