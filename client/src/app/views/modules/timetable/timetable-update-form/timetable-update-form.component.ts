import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-timetable-update-form',
  templateUrl: './timetable-update-form.component.html',
  styleUrls: ['./timetable-update-form.component.scss']
})
export class TimetableUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  timetable: Timetable;

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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

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
    this.timetable = await this.timetableService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TIMETABLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TIMETABLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TIMETABLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TIMETABLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TIMETABLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.gradeField.pristine) {
      this.gradeField.setValue(this.timetable.grade.id);
    }
    if (this.gradeyearField.pristine) {
      this.gradeyearField.setValue(this.timetable.gradeyear.id);
    }
    if (this.subjectField.pristine) {
      this.subjectField.setValue(this.timetable.subject.id);
    }
    if (this.teacherField.pristine) {
      this.teacherField.setValue(this.timetable.teacher.id);
    }
    if (this.dayField.pristine) {
      this.dayField.setValue(this.timetable.day.id);
    }
    if (this.clsField.pristine) {
      this.clsField.setValue(this.timetable.cls.id);
    }
    if (this.timetablestatusField.pristine) {
      this.timetablestatusField.setValue(this.timetable.timetablestatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.timetable.description);
    }
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.timetable.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.timetable.toend);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newtimetable: Timetable = new Timetable();
    newtimetable.grade = this.gradeField.value;
    newtimetable.gradeyear = this.gradeyearField.value;
    newtimetable.subject = this.subjectField.value;
    newtimetable.teacher = this.teacherField.value;
    newtimetable.day = this.dayField.value;
    newtimetable.cls = this.clsField.value;
    newtimetable.timetablestatus = this.timetablestatusField.value;
    newtimetable.description = this.descriptionField.value;
    newtimetable.tostart = this.tostartField.value;
    newtimetable.toend = this.toendField.value;
    try{
      const resourceLink: ResourceLink = await this.timetableService.update(this.selectedId, newtimetable);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/timetables/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/timetables');
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
