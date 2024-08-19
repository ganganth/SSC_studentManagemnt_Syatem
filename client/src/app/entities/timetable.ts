import {Day} from './day';
import {Cls} from './cls';
import {User} from './user';
import {Grade} from './grade';
import {Subject} from './subject';
import {Employee} from './employee';
import {Gradeyear} from './gradeyear';
import {DataPage} from '../shared/data-page';
import {Timetablestatus} from './timetablestatus';

export class Timetable {
  id: number;
  code: string;
  grade: Grade;
  gradeyear: Gradeyear;
  subject: Subject;
  teacher: Employee;
  day: Day;
  cls: Cls;
  timetablestatus: Timetablestatus;
  description: string;
  tostart: string;
  toend: string;
  creator: User;
  tocreation: string;
}

export class TimetableDataPage extends DataPage{
    content: Timetable[];
}
