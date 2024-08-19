import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Clssession} from '../../../../entities/clssession';
import {ClssessionService} from '../../../../services/clssession.service';
import {Cls} from '../../../../entities/cls';
import {Grade} from '../../../../entities/grade';
import {Lesson} from '../../../../entities/lesson';
import {Timetable} from '../../../../entities/timetable';
import {ClsService} from '../../../../services/cls.service';
import {Sheduledate} from '../../../../entities/sheduledate';
import {GradeService} from '../../../../services/grade.service';
import {LessonService} from '../../../../services/lesson.service';
import {Clssessionstatus} from '../../../../entities/clssessionstatus';
import {TimetableService} from '../../../../services/timetable.service';
import {SheduledateService} from '../../../../services/sheduledate.service';
import {ClssessionstatusService} from '../../../../services/clssessionstatus.service';

@Component({
  selector: 'app-clssession-form',
  templateUrl: './clssession-form.component.html',
  styleUrls: ['./clssession-form.component.scss']
})
export class ClssessionFormComponent extends AbstractComponent implements OnInit {

  clses: Cls[] = [];
  grades: Grade[] = [];
  timetables: Timetable[] = [];
  clssessionstatuses: Clssessionstatus[] = [];
  sheduledates: Sheduledate[] = [];
  lessons: Lesson[] = [];

  form = new FormGroup({
    cls: new FormControl(null, [
      Validators.required,
    ]),
    grade: new FormControl(null, [
      Validators.required,
    ]),
    timetable: new FormControl(null, [
      Validators.required,
    ]),
    clssessionstatus: new FormControl(null, [
      Validators.required,
    ]),
    sheduledate: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    clssessionlessons: new FormControl(),
  });

  get clsField(): FormControl{
    return this.form.controls.cls as FormControl;
  }

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get timetableField(): FormControl{
    return this.form.controls.timetable as FormControl;
  }

  get clssessionstatusField(): FormControl{
    return this.form.controls.clssessionstatus as FormControl;
  }

  get sheduledateField(): FormControl{
    return this.form.controls.sheduledate as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get clssessionlessonsField(): FormControl{
    return this.form.controls.clssessionlessons as FormControl;
  }

  constructor(
    private clsService: ClsService,
    private gradeService: GradeService,
    private timetableService: TimetableService,
    private clssessionstatusService: ClssessionstatusService,
    private sheduledateService: SheduledateService,
    private lessonService: LessonService,
    private clssessionService: ClssessionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.lessonService.getAllBasic(new PageRequest()).then((lessonDataPage) => {
      this.lessons = lessonDataPage.content;
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

    this.clsService.getAllBasic(new PageRequest()).then((clsDataPage) => {
      this.clses = clsDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.timetableService.getAllBasic(new PageRequest()).then((timetableDataPage) => {
      this.timetables = timetableDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.clssessionstatusService.getAll().then((clssessionstatuses) => {
      this.clssessionstatuses = clssessionstatuses;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLSSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLSSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLSSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLSSESSION);
  }

  async submit(): Promise<void> {
    this.clssessionlessonsField.updateValueAndValidity();
    this.clssessionlessonsField.markAsTouched();
    if (this.form.invalid) { return; }

    const clssession: Clssession = new Clssession();
    clssession.cls = this.clsField.value;
    clssession.grade = this.gradeField.value;
    clssession.timetable = this.timetableField.value;
    clssession.clssessionstatus = this.clssessionstatusField.value;
    clssession.sheduledate = this.sheduledateField.value;
    clssession.description = this.descriptionField.value;
    clssession.clssessionlessonList = this.clssessionlessonsField.value;
    try{
      const resourceLink: ResourceLink = await this.clssessionService.add(clssession);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/clssessions/' + resourceLink.id);
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
          if (msg.cls) { this.clsField.setErrors({server: msg.cls}); knownError = true; }
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.timetable) { this.timetableField.setErrors({server: msg.timetable}); knownError = true; }
          if (msg.clssessionstatus) { this.clssessionstatusField.setErrors({server: msg.clssessionstatus}); knownError = true; }
          if (msg.sheduledate) { this.sheduledateField.setErrors({server: msg.sheduledate}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.clssessionlessonList) { this.clssessionlessonsField.setErrors({server: msg.clssessionlessonList}); knownError = true; }
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
