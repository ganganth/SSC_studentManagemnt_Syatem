import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Clssubject} from '../../../../../entities/clssubject';
import {Subject} from '../../../../../entities/subject';
import {Employee} from '../../../../../entities/employee';
import {SubjectService} from '../../../../../services/subject.service';
import {EmployeeService} from '../../../../../services/employee.service';

@Component({
  selector: 'app-clssubject-sub-form',
  templateUrl: './clssubject-sub-form.component.html',
  styleUrls: ['./clssubject-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClssubjectSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ClssubjectSubFormComponent),
      multi: true,
    }
  ]
})
export class ClssubjectSubFormComponent extends AbstractSubFormComponent<Clssubject> implements OnInit{

  subjects: Subject[] = [];
  teachers: Employee[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    subject: new FormControl(),
    teacher: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get subjectField(): FormControl{
    return this.form.controls.subject as FormControl;
  }

  get teacherField(): FormControl{
    return this.form.controls.teacher as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.subjectField)
      &&   this.isEmptyField(this.teacherField);
  }

  constructor(
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
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
  }

  setValidations(): void{
    this.hasValidations = true;
    this.subjectField.setValidators([Validators.required]);
    this.teacherField.setValidators([Validators.required]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.subjectField.clearValidators();
    this.teacherField.clearValidators();
  }

  fillForm(dataItem: Clssubject): void {
    this.idField.patchValue(dataItem.id);
    this.subjectField.patchValue(dataItem.subject.id);
    this.teacherField.patchValue(dataItem.teacher.id);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(clssubject: Clssubject): string {
    return 'Are you sure to remove \u201C ' + clssubject.id + ' \u201D from class subject?';
  }

  getUpdateConfirmMessage(clssubject: Clssubject): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + clssubject.id + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + clssubject.id + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Clssubject = new Clssubject();
    dataItem.id = this.idField.value;

    for (const subject of this.subjects){
      if (this.subjectField.value === subject.id) {
        dataItem.subject = subject;
        break;
      }
    }


    for (const teacher of this.teachers){
      if (this.teacherField.value === teacher.id) {
        dataItem.teacher = teacher;
        break;
      }
    }

    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
