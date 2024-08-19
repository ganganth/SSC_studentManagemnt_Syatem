import {User} from './user';
import {Gender} from './gender';
import {Nametitle} from './nametitle';
import {Civilstatus} from './civilstatus';
import {DataPage} from '../shared/data-page';

export class Guardian {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  civilstatus: Civilstatus;
  fullname: string;
  gender: Gender;
  nic: string;
  mobile: string;
  land: string;
  email: string;
  occupation: string;
  address: string;
  officetel1: string;
  officetel2: string;
  officeaddress: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class GuardianDataPage extends DataPage{
    content: Guardian[];
}
