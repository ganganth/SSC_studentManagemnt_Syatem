import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Studentpayment} from '../../../../entities/studentpayment';
import {StudentpaymentService} from '../../../../services/studentpayment.service';
import {Student} from '../../../../entities/student';
import {DateHelper} from '../../../../shared/date-helper';
import {Enrollment} from '../../../../entities/enrollment';
import {StudentService} from '../../../../services/student.service';
import {EnrollmentService} from '../../../../services/enrollment.service';

@Component({
  selector: 'app-studentpayment-form',
  templateUrl: './studentpayment-form.component.html',
  styleUrls: ['./studentpayment-form.component.scss']
})
export class StudentpaymentFormComponent extends AbstractComponent implements OnInit {

  students: Student[] = [];
  enrollments: Enrollment[] = [];

  form = new FormGroup({
    student: new FormControl(null, [
      Validators.required,
    ]),
    enrollment: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get studentField(): FormControl{
    return this.form.controls.student as FormControl;
  }

  get enrollmentField(): FormControl{
    return this.form.controls.enrollment as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private studentService: StudentService,
    private enrollmentService: EnrollmentService,
    private studentpaymentService: StudentpaymentService,
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
    this.enrollmentService.getAllBasic(new PageRequest()).then((enrollmentDataPage) => {
      this.enrollments = enrollmentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const studentpayment: Studentpayment = new Studentpayment();
    studentpayment.student = this.studentField.value;
    studentpayment.enrollment = this.enrollmentField.value;
    studentpayment.amount = this.amountField.value;
    studentpayment.date = DateHelper.getDateAsString(this.dateField.value);
    studentpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentpaymentService.add(studentpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/studentpayments/' + resourceLink.id);
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
          if (msg.enrollment) { this.enrollmentField.setErrors({server: msg.enrollment}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
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
