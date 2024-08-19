import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Cls} from '../../../../entities/cls';
import {ClsService} from '../../../../services/cls.service';
import {ViewChild} from '@angular/core';
import {Medium} from '../../../../entities/medium';
import {Student} from '../../../../entities/student';
import {Employee} from '../../../../entities/employee';
import {Gradeyear} from '../../../../entities/gradeyear';
import {Clsstatus} from '../../../../entities/clsstatus';
import {MediumService} from '../../../../services/medium.service';
import {StudentService} from '../../../../services/student.service';
import {EmployeeService} from '../../../../services/employee.service';
import {GradeyearService} from '../../../../services/gradeyear.service';
import {ClsstatusService} from '../../../../services/clsstatus.service';
import {ClssubjectSubFormComponent} from './clssubject-sub-form/clssubject-sub-form.component';

@Component({
  selector: 'app-cls-form',
  templateUrl: './cls-form.component.html',
  styleUrls: ['./cls-form.component.scss']
})
export class ClsFormComponent extends AbstractComponent implements OnInit {

  gradeyears: Gradeyear[] = [];
  mediums: Medium[] = [];
  teachers: Employee[] = [];
  assistantteachers: Employee[] = [];
  monitors: Student[] = [];
  vicemonitors: Student[] = [];
  students: Student[] = [];
  @ViewChild(ClssubjectSubFormComponent) clssubjectSubForm: ClssubjectSubFormComponent;
  clsstatuses: Clsstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    year: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
    ]),
    gradeyear: new FormControl(null, [
      Validators.required,
    ]),
    medium: new FormControl(null, [
      Validators.required,
    ]),
    teacher: new FormControl(null, [
      Validators.required,
    ]),
    assistantteacher: new FormControl(null, [
      Validators.required,
    ]),
    monitor: new FormControl(null, [
    ]),
    vicemonitor: new FormControl(null, [
    ]),
    clsstudents: new FormControl(),
    clssubjects: new FormControl(),
    clsstatus: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get yearField(): FormControl{
    return this.form.controls.year as FormControl;
  }

  get gradeyearField(): FormControl{
    return this.form.controls.gradeyear as FormControl;
  }

  get mediumField(): FormControl{
    return this.form.controls.medium as FormControl;
  }

  get teacherField(): FormControl{
    return this.form.controls.teacher as FormControl;
  }

  get assistantteacherField(): FormControl{
    return this.form.controls.assistantteacher as FormControl;
  }

  get monitorField(): FormControl{
    return this.form.controls.monitor as FormControl;
  }

  get vicemonitorField(): FormControl{
    return this.form.controls.vicemonitor as FormControl;
  }

  get clsstudentsField(): FormControl{
    return this.form.controls.clsstudents as FormControl;
  }

  get clssubjectsField(): FormControl{
    return this.form.controls.clssubjects as FormControl;
  }

  get clsstatusField(): FormControl{
    return this.form.controls.clsstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeyearService: GradeyearService,
    private mediumService: MediumService,
    private employeeService: EmployeeService,
    private studentService: StudentService,
    private clsstatusService: ClsstatusService,
    private clsService: ClsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.students = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.gradeyearService.getAllBasic(new PageRequest()).then((gradeyearDataPage) => {
      this.gradeyears = gradeyearDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.mediumService.getAll().then((mediums) => {
      this.mediums = mediums;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.teachers = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.assistantteachers = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.monitors = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.vicemonitors = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.clsstatusService.getAll().then((clsstatuses) => {
      this.clsstatuses = clsstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLS);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLS_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLS);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLS);
  }

  async submit(): Promise<void> {
    this.clsstudentsField.updateValueAndValidity();
    this.clsstudentsField.markAsTouched();
    this.clssubjectSubForm.resetForm();
    this.clssubjectsField.markAsDirty();
    if (this.form.invalid) { return; }

    const cls: Cls = new Cls();
    cls.name = this.nameField.value;
    cls.year = this.yearField.value;
    cls.gradeyear = this.gradeyearField.value;
    cls.medium = this.mediumField.value;
    cls.teacher = this.teacherField.value;
    cls.assistantteacher = this.assistantteacherField.value;
    cls.monitor = this.monitorField.value;
    cls.vicemonitor = this.vicemonitorField.value;
    cls.clsstudentList = this.clsstudentsField.value;
    cls.clssubjectList = this.clssubjectsField.value;
    cls.clsstatus = this.clsstatusField.value;
    cls.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.clsService.add(cls);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/clses/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.year) { this.yearField.setErrors({server: msg.year}); knownError = true; }
          if (msg.gradeyear) { this.gradeyearField.setErrors({server: msg.gradeyear}); knownError = true; }
          if (msg.medium) { this.mediumField.setErrors({server: msg.medium}); knownError = true; }
          if (msg.teacher) { this.teacherField.setErrors({server: msg.teacher}); knownError = true; }
          if (msg.assistantteacher) { this.assistantteacherField.setErrors({server: msg.assistantteacher}); knownError = true; }
          if (msg.monitor) { this.monitorField.setErrors({server: msg.monitor}); knownError = true; }
          if (msg.vicemonitor) { this.vicemonitorField.setErrors({server: msg.vicemonitor}); knownError = true; }
          if (msg.clsstudentList) { this.clsstudentsField.setErrors({server: msg.clsstudentList}); knownError = true; }
          if (msg.clssubjectList) { this.clssubjectsField.setErrors({server: msg.clssubjectList}); knownError = true; }
          if (msg.clsstatus) { this.clsstatusField.setErrors({server: msg.clsstatus}); knownError = true; }
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
