import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Exam} from '../../../../entities/exam';
import {ExamService} from '../../../../services/exam.service';
import {Subject} from '../../../../entities/subject';
import {Gradeyear} from '../../../../entities/gradeyear';
import {DateHelper} from '../../../../shared/date-helper';
import {SubjectService} from '../../../../services/subject.service';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.scss']
})
export class ExamFormComponent extends AbstractComponent implements OnInit {

  gradeyears: Gradeyear[] = [];
  subjects: Subject[] = [];

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    tostart: new FormControl(null, [
      Validators.required,
    ]),
    toend: new FormControl(null, [
      Validators.required,
    ]),
    gradeyear: new FormControl(null, [
      Validators.required,
    ]),
    subject: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get tostartField(): FormControl{
    return this.form.controls.tostart as FormControl;
  }

  get toendField(): FormControl{
    return this.form.controls.toend as FormControl;
  }

  get gradeyearField(): FormControl{
    return this.form.controls.gradeyear as FormControl;
  }

  get subjectField(): FormControl{
    return this.form.controls.subject as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeyearService: GradeyearService,
    private subjectService: SubjectService,
    private examService: ExamService,
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EXAM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EXAMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EXAM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EXAM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EXAM);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const exam: Exam = new Exam();
    exam.date = DateHelper.getDateAsString(this.dateField.value);
    exam.tostart = this.tostartField.value;
    exam.toend = this.toendField.value;
    exam.gradeyear = this.gradeyearField.value;
    exam.subject = this.subjectField.value;
    exam.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.examService.add(exam);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/exams/' + resourceLink.id);
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
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.tostart) { this.tostartField.setErrors({server: msg.tostart}); knownError = true; }
          if (msg.toend) { this.toendField.setErrors({server: msg.toend}); knownError = true; }
          if (msg.gradeyear) { this.gradeyearField.setErrors({server: msg.gradeyear}); knownError = true; }
          if (msg.subject) { this.subjectField.setErrors({server: msg.subject}); knownError = true; }
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
