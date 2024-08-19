import {Exam} from './exam';
import {User} from './user';
import {Student} from './student';
import {DataPage} from '../shared/data-page';

export class Examresult {
  id: number;
  code: string;
  exam: Exam;
  student: Student;
  isprersent: boolean;
  marks: number;
  grade: string;
  feedback: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ExamresultDataPage extends DataPage{
    content: Examresult[];
}
