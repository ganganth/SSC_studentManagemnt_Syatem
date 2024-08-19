import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-lesson-update-form',
  templateUrl: './lesson-update-form.component.html',
  styleUrls: ['./lesson-update-form.component.scss']
})
export class LessonUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  lesson: Lesson;

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
    this.lesson = await this.lessonService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LESSON);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LESSONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LESSON_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LESSON);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LESSON);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.gradeField.pristine) {
      this.gradeField.setValue(this.lesson.grade.id);
    }
    if (this.subjectField.pristine) {
      this.subjectField.setValue(this.lesson.subject.id);
    }
    if (this.lessonstatusField.pristine) {
      this.lessonstatusField.setValue(this.lesson.lessonstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.lesson.description);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.lesson.name);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newlesson: Lesson = new Lesson();
    newlesson.grade = this.gradeField.value;
    newlesson.subject = this.subjectField.value;
    newlesson.lessonstatus = this.lessonstatusField.value;
    newlesson.description = this.descriptionField.value;
    newlesson.name = this.nameField.value;
    try{
      const resourceLink: ResourceLink = await this.lessonService.update(this.selectedId, newlesson);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/lessons/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/lessons');
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
