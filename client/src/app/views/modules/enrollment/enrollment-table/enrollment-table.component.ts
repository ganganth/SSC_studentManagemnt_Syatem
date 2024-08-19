import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Enrollment, EnrollmentDataPage} from '../../../../entities/enrollment';
import {EnrollmentService} from '../../../../services/enrollment.service';

@Component({
  selector: 'app-enrollment-table',
  templateUrl: './enrollment-table.component.html',
  styleUrls: ['./enrollment-table.component.scss']
})
export class EnrollmentTableComponent extends AbstractComponent implements OnInit {

  enrollmentDataPage: EnrollmentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private enrollmentService: EnrollmentService,
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


    this.enrollmentService.getAll(pageRequest).then((page: EnrollmentDataPage) => {
      this.enrollmentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ENROLLMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ENROLLMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ENROLLMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ENROLLMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ENROLLMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'fee'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(enrollment: Enrollment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: enrollment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.enrollmentService.delete(enrollment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
