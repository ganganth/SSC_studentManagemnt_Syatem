import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Examresult, ExamresultDataPage} from '../../../../entities/examresult';
import {ExamresultService} from '../../../../services/examresult.service';

@Component({
  selector: 'app-examresult-table',
  templateUrl: './examresult-table.component.html',
  styleUrls: ['./examresult-table.component.scss']
})
export class ExamresultTableComponent extends AbstractComponent implements OnInit {

  examresultDataPage: ExamresultDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  isprersentField = new FormControl();

  constructor(
    private examresultService: ExamresultService,
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
    pageRequest.addSearchCriteria('isprersent', this.isprersentField.value);


    this.examresultService.getAll(pageRequest).then((page: ExamresultDataPage) => {
      this.examresultDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EXAMRESULT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EXAMRESULTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EXAMRESULT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EXAMRESULT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EXAMRESULT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'exam', 'isprersent'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(examresult: Examresult): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: examresult.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.examresultService.delete(examresult.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
