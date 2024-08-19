import {User} from './user';
import {Medium} from './medium';
import {Student} from './student';
import {Employee} from './employee';
import {Gradeyear} from './gradeyear';
import {Clsstatus} from './clsstatus';
import {Clssubject} from './clssubject';
import {DataPage} from '../shared/data-page';

export class Cls {
  id: number;
  code: string;
  name: string;
  year: string;
  gradeyear: Gradeyear;
  medium: Medium;
  teacher: Employee;
  assistantteacher: Employee;
  monitor: Student;
  vicemonitor: Student;
  clsstudentList: Student[];
  clssubjectList: Clssubject[];
  clsstatus: Clsstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class ClsDataPage extends DataPage{
    content: Cls[];
}
