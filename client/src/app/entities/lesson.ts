import {User} from './user';
import {Grade} from './grade';
import {Subject} from './subject';
import {Lessonstatus} from './lessonstatus';
import {DataPage} from '../shared/data-page';

export class Lesson {
  id: number;
  code: string;
  grade: Grade;
  subject: Subject;
  lessonstatus: Lessonstatus;
  description: string;
  name: string;
  creator: User;
  tocreation: string;
}

export class LessonDataPage extends DataPage{
    content: Lesson[];
}
