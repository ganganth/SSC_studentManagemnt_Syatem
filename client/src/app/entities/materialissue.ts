import {Cls} from './cls';
import {User} from './user';
import {Student} from './student';
import {Material} from './material';
import {Gradeyear} from './gradeyear';
import {DataPage} from '../shared/data-page';

export class Materialissue {
  id: number;
  code: string;
  student: Student;
  material: Material;
  gradeyear: Gradeyear;
  cls: Cls;
  date: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class MaterialissueDataPage extends DataPage{
    content: Materialissue[];
}
