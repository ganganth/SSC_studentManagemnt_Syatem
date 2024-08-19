import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Exam} from '../../../../entities/exam';
import {ExamService} from '../../../../services/exam.service';
import {Subject} from '../../../../entities/subject';
import {Gradeyear} from '../../../../entities/gradeyear';
import {DateHelper} from '../../../../shared/date-helper';
import {Examstatus} from '../../../../entities/examstatus';
import {SubjectService} from '../../../../services/subject.service';
import {GradeyearService} from '../../../../services/gradeyear.service';
import {ExamstatusService} from '../../../../services/examstatus.service';

@Component({
  selector: 'app-exam-update-form',
  templateUrl: './exam-update-form.component.html',
  styleUrls: ['./exam-update-form.component.scss']
})
export class ExamUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  exam: Exam;

  gradeyears: Gradeyear[] = [];
  subjects: Subject[] = [];
  examstatuses: Examstatus[] = [];

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
    examstatus: new FormControl('1', [
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

  get examstatusField(): FormControl{
    return this.form.controls.examstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private gradeyearService: GradeyearService,
    private subjectService: SubjectService,
    private examstatusService: ExamstatusService,
    private examService: ExamService,
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
    this.examstatusService.getAll().then((examstatuses) => {
      this.examstatuses = examstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.exam = await this.examService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EXAM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EXAMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EXAM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EXAM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EXAM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.exam.date);
    }
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.exam.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.exam.toend);
    }
    if (this.gradeyearField.pristine) {
      this.gradeyearField.setValue(this.exam.gradeyear.id);
    }
    if (this.subjectField.pristine) {
      this.subjectField.setValue(this.exam.subject.id);
    }
    if (this.examstatusField.pristine) {
      this.examstatusField.setValue(this.exam.examstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.exam.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newexam: Exam = new Exam();
    newexam.date = DateHelper.getDateAsString(this.dateField.value);
    newexam.tostart = this.tostartField.value;
    newexam.toend = this.toendField.value;
    newexam.gradeyear = this.gradeyearField.value;
    newexam.subject = this.subjectField.value;
    newexam.examstatus = this.examstatusField.value;
    newexam.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.examService.update(this.selectedId, newexam);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/exams/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/exams');
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
          if (msg.examstatus) { this.examstatusField.setErrors({server: msg.examstatus}); knownError = true; }
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
