import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Sheduledatestatus} from './sheduledatestatus';

export class Sheduledate {
  id: number;
  code: string;
  date: string;
  tostart: string;
  toend: string;
  scheduledatestatus: Sheduledatestatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class SheduledateDataPage extends DataPage{
    content: Sheduledate[];
}
