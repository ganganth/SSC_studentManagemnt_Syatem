import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-studentattendance-update-form',
  templateUrl: './studentattendance-update-form.component.html',
  styleUrls: ['./studentattendance-update-form.component.scss']
})
export class StudentattendanceUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  studentattendance: Studentattendance;

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
    this.studentattendance = await this.studentattendanceService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTATTENDANCE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.studentField.pristine) {
      this.studentField.setValue(this.studentattendance.student.id);
    }
    if (this.clsField.pristine) {
      this.clsField.setValue(this.studentattendance.cls.id);
    }
    if (this.sheduledateField.pristine) {
      this.sheduledateField.setValue(this.studentattendance.sheduledate.id);
    }
    if (this.attendField.pristine) {
      this.attendField.setValue(this.studentattendance.attend);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.studentattendance.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newstudentattendance: Studentattendance = new Studentattendance();
    newstudentattendance.student = this.studentField.value;
    newstudentattendance.cls = this.clsField.value;
    newstudentattendance.sheduledate = this.sheduledateField.value;
    newstudentattendance.attend = !!this.attendField.value;
    newstudentattendance.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentattendanceService.update(this.selectedId, newstudentattendance);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/studentattendances/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/studentattendances');
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
