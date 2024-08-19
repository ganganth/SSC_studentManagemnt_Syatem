import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Lesson} from '../../../../entities/lesson';
import {Subject} from '../../../../entities/subject';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {LessonService} from '../../../../services/lesson.service';
import {Materialmedium} from '../../../../entities/materialmedium';
import {Materialstatus} from '../../../../entities/materialstatus';
import {SubjectService} from '../../../../services/subject.service';
import {EmployeeService} from '../../../../services/employee.service';
import {MaterialmediumService} from '../../../../services/materialmedium.service';
import {MaterialstatusService} from '../../../../services/materialstatus.service';

@Component({
  selector: 'app-material-update-form',
  templateUrl: './material-update-form.component.html',
  styleUrls: ['./material-update-form.component.scss']
})
export class MaterialUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  material: Material;

  subjects: Subject[] = [];
  lessons: Lesson[] = [];
  employees: Employee[] = [];
  materialmediums: Materialmedium[] = [];
  materialstatuses: Materialstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    file: new FormControl(),
    subject: new FormControl(null, [
      Validators.required,
    ]),
    lesson: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
    ]),
    employee: new FormControl(null, [
    ]),
    materialmedium: new FormControl(null, [
      Validators.required,
    ]),
    materialstatus: new FormControl('1', [
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

  get fileField(): FormControl{
    return this.form.controls.file as FormControl;
  }

  get subjectField(): FormControl{
    return this.form.controls.subject as FormControl;
  }

  get lessonField(): FormControl{
    return this.form.controls.lesson as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get materialmediumField(): FormControl{
    return this.form.controls.materialmedium as FormControl;
  }

  get materialstatusField(): FormControl{
    return this.form.controls.materialstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private employeeService: EmployeeService,
    private materialmediumService: MaterialmediumService,
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
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

    this.subjectService.getAllBasic(new PageRequest()).then((subjectDataPage) => {
      this.subjects = subjectDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.lessonService.getAllBasic(new PageRequest()).then((lessonDataPage) => {
      this.lessons = lessonDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialmediumService.getAll().then((materialmediums) => {
      this.materialmediums = materialmediums;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.material = await this.materialService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.material.name);
    }
    if (this.fileField.pristine) {
      if (this.material.file) { this.fileField.setValue([this.material.file]); }
      else { this.fileField.setValue([]); }
    }
    if (this.subjectField.pristine) {
      this.subjectField.setValue(this.material.subject.id);
    }
    if (this.lessonField.pristine) {
      this.lessonField.setValue(this.material.lesson.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.material.date);
    }
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.material.employee.id);
    }
    if (this.materialmediumField.pristine) {
      this.materialmediumField.setValue(this.material.materialmedium.id);
    }
    if (this.materialstatusField.pristine) {
      this.materialstatusField.setValue(this.material.materialstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.material.description);
    }
}

  async submit(): Promise<void> {
    this.fileField.updateValueAndValidity();
    this.fileField.markAsTouched();
    if (this.form.invalid) { return; }

    const newmaterial: Material = new Material();
    newmaterial.name = this.nameField.value;
    const fileIds = this.fileField.value;
    if (fileIds !== null && fileIds !== []){
      newmaterial.file = fileIds[0];
    }else{
      newmaterial.file = null;
    }
    newmaterial.subject = this.subjectField.value;
    newmaterial.lesson = this.lessonField.value;
    newmaterial.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    newmaterial.employee = this.employeeField.value;
    newmaterial.materialmedium = this.materialmediumField.value;
    newmaterial.materialstatus = this.materialstatusField.value;
    newmaterial.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.update(this.selectedId, newmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materials');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.file) { this.fileField.setErrors({server: msg.file}); knownError = true; }
          if (msg.subject) { this.subjectField.setErrors({server: msg.subject}); knownError = true; }
          if (msg.lesson) { this.lessonField.setErrors({server: msg.lesson}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.materialmedium) { this.materialmediumField.setErrors({server: msg.materialmedium}); knownError = true; }
          if (msg.materialstatus) { this.materialstatusField.setErrors({server: msg.materialstatus}); knownError = true; }
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
