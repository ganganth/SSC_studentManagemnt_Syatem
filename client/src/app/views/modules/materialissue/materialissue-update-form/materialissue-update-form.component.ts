import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Materialissue} from '../../../../entities/materialissue';
import {MaterialissueService} from '../../../../services/materialissue.service';
import {Cls} from '../../../../entities/cls';
import {Student} from '../../../../entities/student';
import {Material} from '../../../../entities/material';
import {Gradeyear} from '../../../../entities/gradeyear';
import {DateHelper} from '../../../../shared/date-helper';
import {ClsService} from '../../../../services/cls.service';
import {StudentService} from '../../../../services/student.service';
import {MaterialService} from '../../../../services/material.service';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-materialissue-update-form',
  templateUrl: './materialissue-update-form.component.html',
  styleUrls: ['./materialissue-update-form.component.scss']
})
export class MaterialissueUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  materialissue: Materialissue;

  students: Student[] = [];
  materials: Material[] = [];
  gradeyears: Gradeyear[] = [];
  clses: Cls[] = [];

  form = new FormGroup({
    student: new FormControl(null, [
    ]),
    material: new FormControl(null, [
    ]),
    gradeyear: new FormControl(null, [
      Validators.required,
    ]),
    cls: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get studentField(): FormControl{
    return this.form.controls.student as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get gradeyearField(): FormControl{
    return this.form.controls.gradeyear as FormControl;
  }

  get clsField(): FormControl{
    return this.form.controls.cls as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private studentService: StudentService,
    private materialService: MaterialService,
    private gradeyearService: GradeyearService,
    private clsService: ClsService,
    private materialissueService: MaterialissueService,
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
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
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
    this.clsService.getAllBasic(new PageRequest()).then((clsDataPage) => {
      this.clses = clsDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialissue = await this.materialissueService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALISSUE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALISSUES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALISSUE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALISSUE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALISSUE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.studentField.pristine) {
      this.studentField.setValue(this.materialissue.student.id);
    }
    if (this.materialField.pristine) {
      this.materialField.setValue(this.materialissue.material.id);
    }
    if (this.gradeyearField.pristine) {
      this.gradeyearField.setValue(this.materialissue.gradeyear.id);
    }
    if (this.clsField.pristine) {
      this.clsField.setValue(this.materialissue.cls.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.materialissue.date);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.materialissue.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newmaterialissue: Materialissue = new Materialissue();
    newmaterialissue.student = this.studentField.value;
    newmaterialissue.material = this.materialField.value;
    newmaterialissue.gradeyear = this.gradeyearField.value;
    newmaterialissue.cls = this.clsField.value;
    newmaterialissue.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    newmaterialissue.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialissueService.update(this.selectedId, newmaterialissue);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materialissues/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materialissues');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.student) { this.studentField.setErrors({server: msg.student}); knownError = true; }
          if (msg.material) { this.materialField.setErrors({server: msg.material}); knownError = true; }
          if (msg.gradeyear) { this.gradeyearField.setErrors({server: msg.gradeyear}); knownError = true; }
          if (msg.cls) { this.clsField.setErrors({server: msg.cls}); knownError = true; }
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
