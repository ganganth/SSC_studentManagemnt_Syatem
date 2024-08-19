import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Lesson} from '../../../../entities/lesson';
import {Subject} from '../../../../entities/subject';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {LessonService} from '../../../../services/lesson.service';
import {Materialmedium} from '../../../../entities/materialmedium';
import {SubjectService} from '../../../../services/subject.service';
import {EmployeeService} from '../../../../services/employee.service';
import {MaterialmediumService} from '../../../../services/materialmedium.service';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent extends AbstractComponent implements OnInit {

  subjects: Subject[] = [];
  lessons: Lesson[] = [];
  employees: Employee[] = [];
  materialmediums: Materialmedium[] = [];

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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private employeeService: EmployeeService,
    private materialmediumService: MaterialmediumService,
    private materialService: MaterialService,
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  async submit(): Promise<void> {
    this.fileField.updateValueAndValidity();
    this.fileField.markAsTouched();
    if (this.form.invalid) { return; }

    const material: Material = new Material();
    material.name = this.nameField.value;
    const fileIds = this.fileField.value;
    if (fileIds !== null && fileIds !== []){
      material.file = fileIds[0];
    }else{
      material.file = null;
    }
    material.subject = this.subjectField.value;
    material.lesson = this.lessonField.value;
    material.date = this.dateField.value ? DateHelper.getDateAsString(this.dateField.value) : null;
    material.employee = this.employeeField.value;
    material.materialmedium = this.materialmediumField.value;
    material.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.materialService.add(material);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.file) { this.fileField.setErrors({server: msg.file}); knownError = true; }
          if (msg.subject) { this.subjectField.setErrors({server: msg.subject}); knownError = true; }
          if (msg.lesson) { this.lessonField.setErrors({server: msg.lesson}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.materialmedium) { this.materialmediumField.setErrors({server: msg.materialmedium}); knownError = true; }
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
