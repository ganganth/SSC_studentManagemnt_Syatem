import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Student, StudentDataPage} from '../../../../entities/student';
import {StudentService} from '../../../../services/student.service';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent extends AbstractComponent implements OnInit {

  studentDataPage: StudentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  callingnameField = new FormControl();
  nicField = new FormControl();

  constructor(
    private studentService: StudentService,
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
    pageRequest.addSearchCriteria('callingname', this.callingnameField.value);
    pageRequest.addSearchCriteria('nic', this.nicField.value);


    this.studentService.getAll(pageRequest).then((page: StudentDataPage) => {
      this.studentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'callingname', 'photo', 'birthcertificate', 'nic', 'studentstatus', 'joineddate'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(student: Student): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: student.code + '-' + student.nametitle.name + ' ' + student.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.studentService.delete(student.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
