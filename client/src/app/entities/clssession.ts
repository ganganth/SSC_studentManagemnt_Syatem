import {Cls} from './cls';
import {User} from './user';
import {Grade} from './grade';
import {Lesson} from './lesson';
import {Timetable} from './timetable';
import {Sheduledate} from './sheduledate';
import {DataPage} from '../shared/data-page';
import {Clssessionstatus} from './clssessionstatus';

export class Clssession {
  id: number;
  code: string;
  cls: Cls;
  grade: Grade;
  timetable: Timetable;
  clssessionstatus: Clssessionstatus;
  sheduledate: Sheduledate;
  description: string;
  clssessionlessonList: Lesson[];
  creator: User;
  tocreation: string;
}

export class ClssessionDataPage extends DataPage{
    content: Clssession[];
}
