import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Subject} from '../../../../entities/subject';
import {SubjectService} from '../../../../services/subject.service';
import {Grade} from '../../../../entities/grade';
import {Medium} from '../../../../entities/medium';
import {Employee} from '../../../../entities/employee';
import {GradeService} from '../../../../services/grade.service';
import {Subjectstatus} from '../../../../entities/subjectstatus';
import {MediumService} from '../../../../services/medium.service';
import {EmployeeService} from '../../../../services/employee.service';
import {SubjectstatusService} from '../../../../services/subjectstatus.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss']
})
export class SubjectFormComponent extends AbstractComponent implements OnInit {

  grades: Grade[] = [];
  mediums: Medium[] = [];
  employees: Employee[] = [];
  subjectstatuses: Subjectstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    grade: new FormControl(null, [
      Validators.required,
    ]),
    medium: new FormControl(null, [
      Validators.required,
    ]),
    subjectteachers: new FormControl(),
    subjectstatus: new FormControl(null, [
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

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get mediumField(): FormControl{
    return this.form.controls.medium as FormControl;
  }

  get subjectteachersField(): FormControl{
    return this.form.controls.subjectteachers as FormControl;
  }

  get subjectstatusField(): FormControl{
    return this.form.controls.subjectstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeService: GradeService,
    private mediumService: MediumService,
    private employeeService: EmployeeService,
    private subjectstatusService: SubjectstatusService,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
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

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
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
    this.subjectstatusService.getAll().then((subjectstatuses) => {
      this.subjectstatuses = subjectstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUBJECT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUBJECTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUBJECT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUBJECT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUBJECT);
  }

  async submit(): Promise<void> {
    this.subjectteachersField.updateValueAndValidity();
    this.subjectteachersField.markAsTouched();
    if (this.form.invalid) { return; }

    const subject: Subject = new Subject();
    subject.name = this.nameField.value;
    subject.grade = this.gradeField.value;
    subject.medium = this.mediumField.value;
    subject.subjectteacherList = this.subjectteachersField.value;
    subject.subjectstatus = this.subjectstatusField.value;
    subject.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.subjectService.add(subject);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/subjects/' + resourceLink.id);
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
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.medium) { this.mediumField.setErrors({server: msg.medium}); knownError = true; }
          if (msg.subjectteacherList) { this.subjectteachersField.setErrors({server: msg.subjectteacherList}); knownError = true; }
          if (msg.subjectstatus) { this.subjectstatusField.setErrors({server: msg.subjectstatus}); knownError = true; }
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
