import {Cls} from './cls';
import {User} from './user';
import {Student} from './student';
import {Sheduledate} from './sheduledate';
import {DataPage} from '../shared/data-page';

export class Studentattendance {
  id: number;
  code: string;
  student: Student;
  cls: Cls;
  sheduledate: Sheduledate;
  attend: boolean;
  description: string;
  creator: User;
  tocreation: string;
}

export class StudentattendanceDataPage extends DataPage{
    content: Studentattendance[];
}
