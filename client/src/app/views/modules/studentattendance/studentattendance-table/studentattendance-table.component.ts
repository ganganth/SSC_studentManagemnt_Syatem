import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Studentattendance, StudentattendanceDataPage} from '../../../../entities/studentattendance';
import {StudentattendanceService} from '../../../../services/studentattendance.service';

@Component({
  selector: 'app-studentattendance-table',
  templateUrl: './studentattendance-table.component.html',
  styleUrls: ['./studentattendance-table.component.scss']
})
export class StudentattendanceTableComponent extends AbstractComponent implements OnInit {

  studentattendanceDataPage: StudentattendanceDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  attendField = new FormControl();

  constructor(
    private studentattendanceService: StudentattendanceService,
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
    pageRequest.addSearchCriteria('attend', this.attendField.value);


    this.studentattendanceService.getAll(pageRequest).then((page: StudentattendanceDataPage) => {
      this.studentattendanceDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTATTENDANCE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'student', 'cls', 'sheduledate'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(studentattendance: Studentattendance): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: studentattendance.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.studentattendanceService.delete(studentattendance.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
