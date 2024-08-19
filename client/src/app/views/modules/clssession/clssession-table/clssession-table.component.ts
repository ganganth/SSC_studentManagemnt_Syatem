import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Clssession, ClssessionDataPage} from '../../../../entities/clssession';
import {ClssessionService} from '../../../../services/clssession.service';
import {Cls} from '../../../../entities/cls';
import {Grade} from '../../../../entities/grade';
import {ClsService} from '../../../../services/cls.service';
import {GradeService} from '../../../../services/grade.service';

@Component({
  selector: 'app-clssession-table',
  templateUrl: './clssession-table.component.html',
  styleUrls: ['./clssession-table.component.scss']
})
export class ClssessionTableComponent extends AbstractComponent implements OnInit {

  clssessionDataPage: ClssessionDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  clses: Cls[] = [];
  grades: Grade[] = [];

  codeField = new FormControl();
  clsField = new FormControl();
  gradeField = new FormControl();


  constructor(
    private clsService: ClsService,
    private gradeService: GradeService,
    private clssessionService: ClssessionService,
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
    pageRequest.addSearchCriteria('cls', this.clsField.value);
    pageRequest.addSearchCriteria('grade', this.gradeField.value);

    this.clsService.getAllBasic(new PageRequest()).then((clsDataPage) => {
      this.clses = clsDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.clssessionService.getAll(pageRequest).then((page: ClssessionDataPage) => {
      this.clssessionDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLSSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLSSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLSSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLSSESSION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'cls', 'grade', 'sheduledate'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(clssession: Clssession): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: clssession.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.clssessionService.delete(clssession.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
