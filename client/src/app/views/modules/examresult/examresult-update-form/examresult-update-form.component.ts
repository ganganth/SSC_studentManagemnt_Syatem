import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Examresult} from '../../../../entities/examresult';
import {ExamresultService} from '../../../../services/examresult.service';
import {Exam} from '../../../../entities/exam';
import {Student} from '../../../../entities/student';
import {ExamService} from '../../../../services/exam.service';
import {StudentService} from '../../../../services/student.service';

@Component({
  selector: 'app-examresult-update-form',
  templateUrl: './examresult-update-form.component.html',
  styleUrls: ['./examresult-update-form.component.scss']
})
export class ExamresultUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  examresult: Examresult;

  exams: Exam[] = [];
  students: Student[] = [];

  form = new FormGroup({
    exam: new FormControl(null, [
    ]),
    student: new FormControl(null, [
      Validators.required,
    ]),
    isprersent: new FormControl(false),
    marks: new FormControl(null, [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^([0-9]{1,3}([.][0-9]{1,2})?)$'),
    ]),
    grade: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    feedback: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get examField(): FormControl{
    return this.form.controls.exam as FormControl;
  }

  get studentField(): FormControl{
    return this.form.controls.student as FormControl;
  }

  get isprersentField(): FormControl{
    return this.form.controls.isprersent as FormControl;
  }

  get marksField(): FormControl{
    return this.form.controls.marks as FormControl;
  }

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get feedbackField(): FormControl{
    return this.form.controls.feedback as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private examService: ExamService,
    private studentService: StudentService,
    private examresultService: ExamresultService,
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

    this.examService.getAllBasic(new PageRequest()).then((examDataPage) => {
      this.exams = examDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.students = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.examresult = await this.examresultService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EXAMRESULT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EXAMRESULTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EXAMRESULT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EXAMRESULT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EXAMRESULT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.examField.pristine) {
      this.examField.setValue(this.examresult.exam.id);
    }
    if (this.studentField.pristine) {
      this.studentField.setValue(this.examresult.student.id);
    }
    if (this.isprersentField.pristine) {
      this.isprersentField.setValue(this.examresult.isprersent);
    }
    if (this.marksField.pristine) {
      this.marksField.setValue(this.examresult.marks);
    }
    if (this.gradeField.pristine) {
      this.gradeField.setValue(this.examresult.grade);
    }
    if (this.feedbackField.pristine) {
      this.feedbackField.setValue(this.examresult.feedback);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.examresult.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newexamresult: Examresult = new Examresult();
    newexamresult.exam = this.examField.value;
    newexamresult.student = this.studentField.value;
    newexamresult.isprersent = !!this.isprersentField.value;
    newexamresult.marks = this.marksField.value;
    newexamresult.grade = this.gradeField.value;
    newexamresult.feedback = this.feedbackField.value;
    newexamresult.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.examresultService.update(this.selectedId, newexamresult);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/examresults/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/examresults');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.exam) { this.examField.setErrors({server: msg.exam}); knownError = true; }
          if (msg.student) { this.studentField.setErrors({server: msg.student}); knownError = true; }
          if (msg.isprersent) { this.isprersentField.setErrors({server: msg.isprersent}); knownError = true; }
          if (msg.marks) { this.marksField.setErrors({server: msg.marks}); knownError = true; }
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.feedback) { this.feedbackField.setErrors({server: msg.feedback}); knownError = true; }
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
