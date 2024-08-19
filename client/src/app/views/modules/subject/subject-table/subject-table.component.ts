import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Subject, SubjectDataPage} from '../../../../entities/subject';
import {SubjectService} from '../../../../services/subject.service';
import {Grade} from '../../../../entities/grade';
import {Medium} from '../../../../entities/medium';
import {GradeService} from '../../../../services/grade.service';
import {MediumService} from '../../../../services/medium.service';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss']
})
export class SubjectTableComponent extends AbstractComponent implements OnInit {

  subjectDataPage: SubjectDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  grades: Grade[] = [];
  mediums: Medium[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  gradeField = new FormControl();
  mediumField = new FormControl();

  constructor(
    private gradeService: GradeService,
    private mediumService: MediumService,
    private subjectService: SubjectService,
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
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('grade', this.gradeField.value);
    pageRequest.addSearchCriteria('medium', this.mediumField.value);

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.mediumService.getAll().then((mediums) => {
      this.mediums = mediums;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.subjectService.getAll(pageRequest).then((page: SubjectDataPage) => {
      this.subjectDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUBJECT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SUBJECTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SUBJECT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUBJECT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUBJECT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(subject: Subject): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: subject.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.subjectService.delete(subject.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
