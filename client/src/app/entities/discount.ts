import {User} from './user';
import {Discounttype} from './discounttype';
import {DataPage} from '../shared/data-page';
import {Discountstatus} from './discountstatus';

export class Discount {
  id: number;
  code: string;
  name: string;
  fixedamount: number;
  percentage: number;
  discounttype: Discounttype;
  discountstatus: Discountstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class DiscountDataPage extends DataPage{
    content: Discount[];
}
