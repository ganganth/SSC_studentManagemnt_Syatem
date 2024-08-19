import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Gradeyear} from '../../../../entities/gradeyear';
import {GradeyearService} from '../../../../services/gradeyear.service';
import {ViewChild} from '@angular/core';
import {Grade} from '../../../../entities/grade';
import {DateHelper} from '../../../../shared/date-helper';
import {GradeService} from '../../../../services/grade.service';
import {Gradeyearstatus} from '../../../../entities/gradeyearstatus';
import {GradeyearstatusService} from '../../../../services/gradeyearstatus.service';
import {YeartermUpdateSubFormComponent} from './yearterm-update-sub-form/yearterm-update-sub-form.component';

@Component({
  selector: 'app-gradeyear-update-form',
  templateUrl: './gradeyear-update-form.component.html',
  styleUrls: ['./gradeyear-update-form.component.scss']
})
export class GradeyearUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  gradeyear: Gradeyear;

  grades: Grade[] = [];
  gradeyearstatuses: Gradeyearstatus[] = [];
  @ViewChild(YeartermUpdateSubFormComponent) yeartermUpdateSubForm: YeartermUpdateSubFormComponent;

  form = new FormGroup({
    year: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    dostart: new FormControl(null, [
      Validators.required,
    ]),
    doend: new FormControl(null, [
      Validators.required,
    ]),
    totalfee: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    grade: new FormControl(null, [
      Validators.required,
    ]),
    gradeyearstatus: new FormControl(null, [
      Validators.required,
    ]),
    yearterms: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get yearField(): FormControl{
    return this.form.controls.year as FormControl;
  }

  get dostartField(): FormControl{
    return this.form.controls.dostart as FormControl;
  }

  get doendField(): FormControl{
    return this.form.controls.doend as FormControl;
  }

  get totalfeeField(): FormControl{
    return this.form.controls.totalfee as FormControl;
  }

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get gradeyearstatusField(): FormControl{
    return this.form.controls.gradeyearstatus as FormControl;
  }

  get yeartermsField(): FormControl{
    return this.form.controls.yearterms as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeService: GradeService,
    private gradeyearstatusService: GradeyearstatusService,
    private gradeyearService: GradeyearService,
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
    this.gradeyearstatusService.getAll().then((gradeyearstatuses) => {
      this.gradeyearstatuses = gradeyearstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradeyear = await this.gradeyearService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEYEAR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEYEARS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEYEAR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEYEAR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEYEAR);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.yearField.pristine) {
      this.yearField.setValue(this.gradeyear.year);
    }
    if (this.dostartField.pristine) {
      this.dostartField.setValue(this.gradeyear.dostart);
    }
    if (this.doendField.pristine) {
      this.doendField.setValue(this.gradeyear.doend);
    }
    if (this.totalfeeField.pristine) {
      this.totalfeeField.setValue(this.gradeyear.totalfee);
    }
    if (this.gradeField.pristine) {
      this.gradeField.setValue(this.gradeyear.grade.id);
    }
    if (this.gradeyearstatusField.pristine) {
      this.gradeyearstatusField.setValue(this.gradeyear.gradeyearstatus.id);
    }
    if (this.yeartermsField.pristine) {
      this.yeartermsField.setValue(this.gradeyear.yeartermList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.gradeyear.description);
    }
}

  async submit(): Promise<void> {
    this.yeartermUpdateSubForm.resetForm();
    this.yeartermsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newgradeyear: Gradeyear = new Gradeyear();
    newgradeyear.year = this.yearField.value;
    newgradeyear.dostart = DateHelper.getDateAsString(this.dostartField.value);
    newgradeyear.doend = DateHelper.getDateAsString(this.doendField.value);
    newgradeyear.totalfee = this.totalfeeField.value;
    newgradeyear.grade = this.gradeField.value;
    newgradeyear.gradeyearstatus = this.gradeyearstatusField.value;
    newgradeyear.yeartermList = this.yeartermsField.value;
    newgradeyear.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.gradeyearService.update(this.selectedId, newgradeyear);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/gradeyears/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/gradeyears');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.year) { this.yearField.setErrors({server: msg.year}); knownError = true; }
          if (msg.dostart) { this.dostartField.setErrors({server: msg.dostart}); knownError = true; }
          if (msg.doend) { this.doendField.setErrors({server: msg.doend}); knownError = true; }
          if (msg.totalfee) { this.totalfeeField.setErrors({server: msg.totalfee}); knownError = true; }
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.gradeyearstatus) { this.gradeyearstatusField.setErrors({server: msg.gradeyearstatus}); knownError = true; }
          if (msg.yeartermList) { this.yeartermsField.setErrors({server: msg.yeartermList}); knownError = true; }
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
