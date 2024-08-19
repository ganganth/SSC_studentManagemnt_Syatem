import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Timetable} from '../../../../entities/timetable';
import {TimetableService} from '../../../../services/timetable.service';
import {Day} from '../../../../entities/day';
import {Cls} from '../../../../entities/cls';
import {Grade} from '../../../../entities/grade';
import {Subject} from '../../../../entities/subject';
import {Employee} from '../../../../entities/employee';
import {Gradeyear} from '../../../../entities/gradeyear';
import {DayService} from '../../../../services/day.service';
import {ClsService} from '../../../../services/cls.service';
import {GradeService} from '../../../../services/grade.service';
import {SubjectService} from '../../../../services/subject.service';
import {Timetablestatus} from '../../../../entities/timetablestatus';
import {EmployeeService} from '../../../../services/employee.service';
import {GradeyearService} from '../../../../services/gradeyear.service';
import {TimetablestatusService} from '../../../../services/timetablestatus.service';

@Component({
  selector: 'app-timetable-form',
  templateUrl: './timetable-form.component.html',
  styleUrls: ['./timetable-form.component.scss']
})
export class TimetableFormComponent extends AbstractComponent implements OnInit {

  grades: Grade[] = [];
  gradeyears: Gradeyear[] = [];
  subjects: Subject[] = [];
  teachers: Employee[] = [];
  days: Day[] = [];
  clses: Cls[] = [];
  timetablestatuses: Timetablestatus[] = [];

  form = new FormGroup({
    grade: new FormControl(null, [
      Validators.required,
    ]),
    gradeyear: new FormControl(null, [
      Validators.required,
    ]),
    subject: new FormControl(null, [
      Validators.required,
    ]),
    teacher: new FormControl(null, [
      Validators.required,
    ]),
    day: new FormControl(null, [
      Validators.required,
    ]),
    cls: new FormControl(null, [
      Validators.required,
    ]),
    timetablestatus: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    tostart: new FormControl(null, [
      Validators.required,
    ]),
    toend: new FormControl(null, [
      Validators.required,
    ]),
  });

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get gradeyearField(): FormControl{
    return this.form.controls.gradeyear as FormControl;
  }

  get subjectField(): FormControl{
    return this.form.controls.subject as FormControl;
  }

  get teacherField(): FormControl{
    return this.form.controls.teacher as FormControl;
  }

  get dayField(): FormControl{
    return this.form.controls.day as FormControl;
  }

  get clsField(): FormControl{
    return this.form.controls.cls as FormControl;
  }

  get timetablestatusField(): FormControl{
    return this.form.controls.timetablestatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get tostartField(): FormControl{
    return this.form.controls.tostart as FormControl;
  }

  get toendField(): FormControl{
    return this.form.controls.toend as FormControl;
  }

  constructor(
    private gradeService: GradeService,
    private gradeyearService: GradeyearService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private dayService: DayService,
    private clsService: ClsService,
    private timetablestatusService: TimetablestatusService,
    private timetableService: TimetableService,
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

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradeyearService.getAllBasic(new PageRequest()).then((gradeyearDataPage) => {
      this.gradeyears = gradeyearDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.subjectService.getAllBasic(new PageRequest()).then((subjectDataPage) => {
      this.subjects = subjectDataPage.content;
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
    this.dayService.getAll().then((days) => {
      this.days = days;
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
    this.timetablestatusService.getAll().then((timetablestatuses) => {
      this.timetablestatuses = timetablestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TIMETABLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TIMETABLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TIMETABLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TIMETABLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TIMETABLE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const timetable: Timetable = new Timetable();
    timetable.grade = this.gradeField.value;
    timetable.gradeyear = this.gradeyearField.value;
    timetable.subject = this.subjectField.value;
    timetable.teacher = this.teacherField.value;
    timetable.day = this.dayField.value;
    timetable.cls = this.clsField.value;
    timetable.timetablestatus = this.timetablestatusField.value;
    timetable.description = this.descriptionField.value;
    timetable.tostart = this.tostartField.value;
    timetable.toend = this.toendField.value;
    try{
      const resourceLink: ResourceLink = await this.timetableService.add(timetable);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/timetables/' + resourceLink.id);
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
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.gradeyear) { this.gradeyearField.setErrors({server: msg.gradeyear}); knownError = true; }
          if (msg.subject) { this.subjectField.setErrors({server: msg.subject}); knownError = true; }
          if (msg.teacher) { this.teacherField.setErrors({server: msg.teacher}); knownError = true; }
          if (msg.day) { this.dayField.setErrors({server: msg.day}); knownError = true; }
          if (msg.cls) { this.clsField.setErrors({server: msg.cls}); knownError = true; }
          if (msg.timetablestatus) { this.timetablestatusField.setErrors({server: msg.timetablestatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.tostart) { this.tostartField.setErrors({server: msg.tostart}); knownError = true; }
          if (msg.toend) { this.toendField.setErrors({server: msg.toend}); knownError = true; }
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
