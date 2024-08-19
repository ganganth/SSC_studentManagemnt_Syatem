import {User} from './user';
import {Grade} from './grade';
import {Medium} from './medium';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Subjectstatus} from './subjectstatus';

export class Subject {
  id: number;
  code: string;
  name: string;
  grade: Grade;
  medium: Medium;
  subjectteacherList: Employee[];
  subjectstatus: Subjectstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class SubjectDataPage extends DataPage{
    content: Subject[];
}
