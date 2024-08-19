import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Enrollment} from '../../../../entities/enrollment';
import {EnrollmentService} from '../../../../services/enrollment.service';
import {Student} from '../../../../entities/student';
import {Discount} from '../../../../entities/discount';
import {Payscheme} from '../../../../entities/payscheme';
import {Gradeyear} from '../../../../entities/gradeyear';
import {StudentService} from '../../../../services/student.service';
import {DiscountService} from '../../../../services/discount.service';
import {Enrollmentstatus} from '../../../../entities/enrollmentstatus';
import {PayschemeService} from '../../../../services/payscheme.service';
import {GradeyearService} from '../../../../services/gradeyear.service';
import {EnrollmentstatusService} from '../../../../services/enrollmentstatus.service';

@Component({
  selector: 'app-enrollment-update-form',
  templateUrl: './enrollment-update-form.component.html',
  styleUrls: ['./enrollment-update-form.component.scss']
})
export class EnrollmentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  enrollment: Enrollment;

  students: Student[] = [];
  payschemes: Payscheme[] = [];
  gradeyears: Gradeyear[] = [];
  enrollmentstatuses: Enrollmentstatus[] = [];
  discounts: Discount[] = [];

  form = new FormGroup({
    discountamount: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    fee: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    student: new FormControl(null, [
      Validators.required,
    ]),
    payscheme: new FormControl(null, [
      Validators.required,
    ]),
    gradeyear: new FormControl(null, [
      Validators.required,
    ]),
    enrollmentstatus: new FormControl(null, [
      Validators.required,
    ]),
    enrollmentdiscounts: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get discountamountField(): FormControl{
    return this.form.controls.discountamount as FormControl;
  }

  get feeField(): FormControl{
    return this.form.controls.fee as FormControl;
  }

  get studentField(): FormControl{
    return this.form.controls.student as FormControl;
  }

  get payschemeField(): FormControl{
    return this.form.controls.payscheme as FormControl;
  }

  get gradeyearField(): FormControl{
    return this.form.controls.gradeyear as FormControl;
  }

  get enrollmentstatusField(): FormControl{
    return this.form.controls.enrollmentstatus as FormControl;
  }

  get enrollmentdiscountsField(): FormControl{
    return this.form.controls.enrollmentdiscounts as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private studentService: StudentService,
    private payschemeService: PayschemeService,
    private gradeyearService: GradeyearService,
    private enrollmentstatusService: EnrollmentstatusService,
    private discountService: DiscountService,
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.discountService.getAllBasic(new PageRequest()).then((discountDataPage) => {
      this.discounts = discountDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
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
    this.payschemeService.getAll().then((payschemes) => {
      this.payschemes = payschemes;
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
    this.enrollmentstatusService.getAll().then((enrollmentstatuses) => {
      this.enrollmentstatuses = enrollmentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.enrollment = await this.enrollmentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ENROLLMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ENROLLMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ENROLLMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ENROLLMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ENROLLMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.discountamountField.pristine) {
      this.discountamountField.setValue(this.enrollment.discountamount);
    }
    if (this.feeField.pristine) {
      this.feeField.setValue(this.enrollment.fee);
    }
    if (this.studentField.pristine) {
      this.studentField.setValue(this.enrollment.student.id);
    }
    if (this.payschemeField.pristine) {
      this.payschemeField.setValue(this.enrollment.payscheme.id);
    }
    if (this.gradeyearField.pristine) {
      this.gradeyearField.setValue(this.enrollment.gradeyear.id);
    }
    if (this.enrollmentstatusField.pristine) {
      this.enrollmentstatusField.setValue(this.enrollment.enrollmentstatus.id);
    }
    if (this.enrollmentdiscountsField.pristine) {
      this.enrollmentdiscountsField.setValue(this.enrollment.enrollmentdiscountList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.enrollment.description);
    }
}

  async submit(): Promise<void> {
    this.enrollmentdiscountsField.updateValueAndValidity();
    this.enrollmentdiscountsField.markAsTouched();
    if (this.form.invalid) { return; }

    const newenrollment: Enrollment = new Enrollment();
    newenrollment.discountamount = this.discountamountField.value;
    newenrollment.fee = this.feeField.value;
    newenrollment.student = this.studentField.value;
    newenrollment.payscheme = this.payschemeField.value;
    newenrollment.gradeyear = this.gradeyearField.value;
    newenrollment.enrollmentstatus = this.enrollmentstatusField.value;
    newenrollment.enrollmentdiscountList = this.enrollmentdiscountsField.value;
    newenrollment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.enrollmentService.update(this.selectedId, newenrollment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/enrollments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/enrollments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.discountamount) { this.discountamountField.setErrors({server: msg.discountamount}); knownError = true; }
          if (msg.fee) { this.feeField.setErrors({server: msg.fee}); knownError = true; }
          if (msg.student) { this.studentField.setErrors({server: msg.student}); knownError = true; }
          if (msg.payscheme) { this.payschemeField.setErrors({server: msg.payscheme}); knownError = true; }
          if (msg.gradeyear) { this.gradeyearField.setErrors({server: msg.gradeyear}); knownError = true; }
          if (msg.enrollmentstatus) { this.enrollmentstatusField.setErrors({server: msg.enrollmentstatus}); knownError = true; }
          if (msg.enrollmentdiscountList) { this.enrollmentdiscountsField.setErrors({server: msg.enrollmentdiscountList}); knownError = true; }
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
