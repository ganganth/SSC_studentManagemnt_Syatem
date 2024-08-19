import {User} from './user';
import {Student} from './student';
import {Discount} from './discount';
import {Payscheme} from './payscheme';
import {Gradeyear} from './gradeyear';
import {DataPage} from '../shared/data-page';
import {Enrollmentstatus} from './enrollmentstatus';

export class Enrollment {
  id: number;
  code: string;
  discountamount: number;
  fee: number;
  balance: number;
  student: Student;
  payscheme: Payscheme;
  gradeyear: Gradeyear;
  enrollmentstatus: Enrollmentstatus;
  enrollmentdiscountList: Discount[];
  description: string;
  creator: User;
  tocreation: string;
}

export class EnrollmentDataPage extends DataPage{
    content: Enrollment[];
}
