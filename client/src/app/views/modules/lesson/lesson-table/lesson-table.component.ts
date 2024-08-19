import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Lesson, LessonDataPage} from '../../../../entities/lesson';
import {LessonService} from '../../../../services/lesson.service';
import {Grade} from '../../../../entities/grade';
import {Subject} from '../../../../entities/subject';
import {GradeService} from '../../../../services/grade.service';
import {SubjectService} from '../../../../services/subject.service';

@Component({
  selector: 'app-lesson-table',
  templateUrl: './lesson-table.component.html',
  styleUrls: ['./lesson-table.component.scss']
})
export class LessonTableComponent extends AbstractComponent implements OnInit {

  lessonDataPage: LessonDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  grades: Grade[] = [];
  subjects: Subject[] = [];

  codeField = new FormControl();
  gradeField = new FormControl();
  subjectField = new FormControl();
  nameField = new FormControl();

  constructor(
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('grade', this.gradeField.value);
    pageRequest.addSearchCriteria('subject', this.subjectField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);

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

    this.lessonService.getAll(pageRequest).then((page: LessonDataPage) => {
      this.lessonDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'grade', 'subject', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(lesson: Lesson): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: lesson.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.lessonService.delete(lesson.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
