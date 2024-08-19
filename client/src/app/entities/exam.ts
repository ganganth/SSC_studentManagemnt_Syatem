import {User} from './user';
import {Subject} from './subject';
import {Gradeyear} from './gradeyear';
import {Examstatus} from './examstatus';
import {DataPage} from '../shared/data-page';

export class Exam {
  id: number;
  code: string;
  date: string;
  tostart: string;
  toend: string;
  gradeyear: Gradeyear;
  subject: Subject;
  examstatus: Examstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class ExamDataPage extends DataPage{
    content: Exam[];
}
