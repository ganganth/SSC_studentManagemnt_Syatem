import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Studentattendance} from '../../../../entities/studentattendance';
import {StudentattendanceService} from '../../../../services/studentattendance.service';
import {Cls} from '../../../../entities/cls';
import {Student} from '../../../../entities/student';
import {ClsService} from '../../../../services/cls.service';
import {Sheduledate} from '../../../../entities/sheduledate';
import {StudentService} from '../../../../services/student.service';
import {SheduledateService} from '../../../../services/sheduledate.service';

@Component({
  selector: 'app-studentattendance-form',
  templateUrl: './studentattendance-form.component.html',
  styleUrls: ['./studentattendance-form.component.scss']
})
export class StudentattendanceFormComponent extends AbstractComponent implements OnInit {

  students: Student[] = [];
  clses: Cls[] = [];
  sheduledates: Sheduledate[] = [];

  form = new FormGroup({
    student: new FormControl(null, [
      Validators.required,
    ]),
    cls: new FormControl(null, [
      Validators.required,
    ]),
    sheduledate: new FormControl(null, [
      Validators.required,
    ]),
    attend: new FormControl(false),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get studentField(): FormControl{
    return this.form.controls.student as FormControl;
  }

  get clsField(): FormControl{
    return this.form.controls.cls as FormControl;
  }

  get sheduledateField(): FormControl{
    return this.form.controls.sheduledate as FormControl;
  }

  get attendField(): FormControl{
    return this.form.controls.attend as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private studentService: StudentService,
    private clsService: ClsService,
    private sheduledateService: SheduledateService,
    private studentattendanceService: StudentattendanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.students = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.clsService.getAllBasic(new PageRequest()).then((clsDataPage) => {
      this.clses = clsDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.sheduledateService.getAllBasic(new PageRequest()).then((sheduledateDataPage) => {
      this.sheduledates = sheduledateDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTATTENDANCE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const studentattendance: Studentattendance = new Studentattendance();
    studentattendance.student = this.studentField.value;
    studentattendance.cls = this.clsField.value;
    studentattendance.sheduledate = this.sheduledateField.value;
    studentattendance.attend = !!this.attendField.value;
    studentattendance.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentattendanceService.add(studentattendance);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/studentattendances/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.student) { this.studentField.setErrors({server: msg.student}); knownError = true; }
          if (msg.cls) { this.clsField.setErrors({server: msg.cls}); knownError = true; }
          if (msg.sheduledate) { this.sheduledateField.setErrors({server: msg.sheduledate}); knownError = true; }
          if (msg.attend) { this.attendField.setErrors({server: msg.attend}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
