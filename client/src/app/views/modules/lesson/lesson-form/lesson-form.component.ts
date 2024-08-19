import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Lesson} from '../../../../entities/lesson';
import {LessonService} from '../../../../services/lesson.service';
import {Grade} from '../../../../entities/grade';
import {Subject} from '../../../../entities/subject';
import {Lessonstatus} from '../../../../entities/lessonstatus';
import {GradeService} from '../../../../services/grade.service';
import {SubjectService} from '../../../../services/subject.service';
import {LessonstatusService} from '../../../../services/lessonstatus.service';

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.scss']
})
export class LessonFormComponent extends AbstractComponent implements OnInit {

  grades: Grade[] = [];
  subjects: Subject[] = [];
  lessonstatuses: Lessonstatus[] = [];

  form = new FormGroup({
    grade: new FormControl(null, [
      Validators.required,
    ]),
    subject: new FormControl(null, [
      Validators.required,
    ]),
    lessonstatus: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
  });

  get gradeField(): FormControl{
    return this.form.controls.grade as FormControl;
  }

  get subjectField(): FormControl{
    return this.form.controls.subject as FormControl;
  }

  get lessonstatusField(): FormControl{
    return this.form.controls.lessonstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  constructor(
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private lessonstatusService: LessonstatusService,
    private lessonService: LessonService,
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

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
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
    this.lessonstatusService.getAll().then((lessonstatuses) => {
      this.lessonstatuses = lessonstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LESSON);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LESSONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LESSON_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LESSON);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LESSON);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const lesson: Lesson = new Lesson();
    lesson.grade = this.gradeField.value;
    lesson.subject = this.subjectField.value;
    lesson.lessonstatus = this.lessonstatusField.value;
    lesson.description = this.descriptionField.value;
    lesson.name = this.nameField.value;
    try{
      const resourceLink: ResourceLink = await this.lessonService.add(lesson);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/lessons/' + resourceLink.id);
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
          if (msg.grade) { this.gradeField.setErrors({server: msg.grade}); knownError = true; }
          if (msg.subject) { this.subjectField.setErrors({server: msg.subject}); knownError = true; }
          if (msg.lessonstatus) { this.lessonstatusField.setErrors({server: msg.lessonstatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
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
