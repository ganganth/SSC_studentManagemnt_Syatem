import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Cls, ClsDataPage} from '../../../../entities/cls';
import {ClsService} from '../../../../services/cls.service';
import {Medium} from '../../../../entities/medium';
import {Student} from '../../../../entities/student';
import {Employee} from '../../../../entities/employee';
import {MediumService} from '../../../../services/medium.service';
import {StudentService} from '../../../../services/student.service';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-cls-table',
  templateUrl: './cls-table.component.html',
  styleUrls: ['./cls-table.component.scss']
})
export class ClsTableComponent extends AbstractComponent implements OnInit {

  clsDataPage: ClsDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  mediums: Medium[] = [];
  teachers: Employee[] = [];
  assistantteachers: Employee[] = [];
  monitors: Student[] = [];
  vicemonitors: Student[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  mediumField = new FormControl();
  teacherField = new FormControl();
  assistantteacherField = new FormControl();
  monitorField = new FormControl();
  vicemonitorField = new FormControl();

  constructor(
    private mediumService: MediumService,
    private employeeService: EmployeeService,
    private studentService: StudentService,
    private clsService: ClsService,
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
    pageRequest.addSearchCriteria('medium', this.mediumField.value);
    pageRequest.addSearchCriteria('teacher', this.teacherField.value);
    pageRequest.addSearchCriteria('assistantteacher', this.assistantteacherField.value);
    pageRequest.addSearchCriteria('monitor', this.monitorField.value);
    pageRequest.addSearchCriteria('vicemonitor', this.vicemonitorField.value);

    this.mediumService.getAll().then((mediums) => {
      this.mediums = mediums;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.teachers = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.assistantteachers = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.monitors = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.studentService.getAllBasic(new PageRequest()).then((studentDataPage) => {
      this.vicemonitors = studentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.clsService.getAll(pageRequest).then((page: ClsDataPage) => {
      this.clsDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLS);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLS_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLS);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLS);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'year', 'teacher', 'assistantteacher', 'monitor', 'vicemonitor'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(cls: Cls): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: cls.code + '-' + cls.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.clsService.delete(cls.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
