import {User} from './user';
import {House} from './house';
import {Gender} from './gender';
import {Guardian} from './guardian';
import {Religion} from './religion';
import {Nametitle} from './nametitle';
import {Bloodtype} from './bloodtype';
import {Ethnicity} from './ethnicity';
import {DataPage} from '../shared/data-page';
import {Studentstatus} from './studentstatus';
import {Guardianrelationship} from './guardianrelationship';

export class Student {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  fullname: string;
  photo: string;
  birthcertificate: string;
  dobirth: string;
  gender: Gender;
  nic: string;
  guardian: Guardian;
  guardianrelationship: Guardianrelationship;
  bloodtype: Bloodtype;
  religion: Religion;
  ethnicity: Ethnicity;
  house: House;
  studentstatus: Studentstatus;
  mobile: string;
  land: string;
  email: string;
  joineddate: string;
  address: string;
  admissionfee: number;
  description: string;
  creator: User;
  tocreation: string;
}

export class StudentDataPage extends DataPage{
    content: Student[];
}
