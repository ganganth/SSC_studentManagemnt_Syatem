import {User} from './user';
import {Grade} from './grade';
import {Yearterm} from './yearterm';
import {DataPage} from '../shared/data-page';
import {Gradeyearstatus} from './gradeyearstatus';

export class Gradeyear {
  id: number;
  code: string;
  year: string;
  dostart: string;
  doend: string;
  totalfee: number;
  grade: Grade;
  gradeyearstatus: Gradeyearstatus;
  yeartermList: Yearterm[];
  description: string;
  creator: User;
  tocreation: string;
}

export class GradeyearDataPage extends DataPage{
    content: Gradeyear[];
}
