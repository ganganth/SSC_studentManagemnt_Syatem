import {Role} from './role';
import {DataPage} from '../shared/data-page';
import {Student} from './student';
import {Employee} from './employee';
import {Guardian} from './guardian';

export class User {
  id: number;
  roleList: Role[];
  username: string;
  password: string;
  status: string;
  tocreation: string;
  creator: User;
  photo: string;

  student: Student;
  employee: Employee;
  guardian: Guardian;

  static getDisplayName(user: User): string{
    if (user.student) { return user.student.code + ' - ' + user.student.callingname; }
    if (user.employee) { return user.employee.code + '-' + user.employee.nametitle.name + ' ' + user.employee.callingname; }
    if (user.guardian) { return user.guardian.code + ' - ' + user.guardian.nametitle.name + ' ' + user.guardian.callingname; }
    return user.username;
  }
}

export class UserDataPage extends DataPage{
  content: User[];
}
