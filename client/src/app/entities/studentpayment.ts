import {User} from './user';
import {Student} from './student';
import {Enrollment} from './enrollment';
import {DataPage} from '../shared/data-page';

export class Studentpayment {
  id: number;
  code: string;
  student: Student;
  enrollment: Enrollment;
  prevbalance: number;
  amount: number;
  balance: number;
  insno: number;
  date: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class StudentpaymentDataPage extends DataPage{
    content: Studentpayment[];
}
