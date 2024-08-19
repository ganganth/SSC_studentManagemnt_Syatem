import {User} from './user';
import {Lesson} from './lesson';
import {Subject} from './subject';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';
import {Materialmedium} from './materialmedium';
import {Materialstatus} from './materialstatus';

export class Material {
  id: number;
  code: string;
  name: string;
  file: string;
  subject: Subject;
  lesson: Lesson;
  date: string;
  employee: Employee;
  materialmedium: Materialmedium;
  materialstatus: Materialstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class MaterialDataPage extends DataPage{
    content: Material[];
}
