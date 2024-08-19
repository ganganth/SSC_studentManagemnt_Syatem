import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Studentpayment} from '../../../../entities/studentpayment';
import {StudentpaymentService} from '../../../../services/studentpayment.service';
import {Student} from '../../../../entities/student';
import {DateHelper} from '../../../../shared/date-helper';
import {Enrollment} from '../../../../entities/enrollment';
import {StudentService} from '../../../../services/student.service';
import {EnrollmentService} from '../../../../services/enrollment.service';

@Component({
  selector: 'app-studentpayment-update-form',
  templateUrl: './studentpayment-update-form.component.html',
  styleUrls: ['./studentpayment-update-form.component.scss']
})
export class StudentpaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  studentpayment: Studentpayment;

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
    this.enrollmentService.getAllBasic(new PageRequest()).then((enrollmentDataPage) => {
      this.enrollments = enrollmentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentpayment = await this.studentpaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.studentField.pristine) {
      this.studentField.setValue(this.studentpayment.student.id);
    }
    if (this.enrollmentField.pristine) {
      this.enrollmentField.setValue(this.studentpayment.enrollment.id);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.studentpayment.amount);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.studentpayment.date);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.studentpayment.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newstudentpayment: Studentpayment = new Studentpayment();
    newstudentpayment.student = this.studentField.value;
    newstudentpayment.enrollment = this.enrollmentField.value;
    newstudentpayment.amount = this.amountField.value;
    newstudentpayment.date = DateHelper.getDateAsString(this.dateField.value);
    newstudentpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentpaymentService.update(this.selectedId, newstudentpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/studentpayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/studentpayments');
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
