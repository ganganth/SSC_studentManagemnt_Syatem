import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Timetable, TimetableDataPage} from '../../../../entities/timetable';
import {TimetableService} from '../../../../services/timetable.service';
import {Cls} from '../../../../entities/cls';
import {Grade} from '../../../../entities/grade';
import {Subject} from '../../../../entities/subject';
import {Employee} from '../../../../entities/employee';
import {Gradeyear} from '../../../../entities/gradeyear';
import {ClsService} from '../../../../services/cls.service';
import {GradeService} from '../../../../services/grade.service';
import {SubjectService} from '../../../../services/subject.service';
import {EmployeeService} from '../../../../services/employee.service';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-timetable-table',
  templateUrl: './timetable-table.component.html',
  styleUrls: ['./timetable-table.component.scss']
})
export class TimetableTableComponent extends AbstractComponent implements OnInit {

  timetableDataPage: TimetableDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  grades: Grade[] = [];
  gradeyears: Gradeyear[] = [];
  subjects: Subject[] = [];
  teachers: Employee[] = [];
  clses: Cls[] = [];

  codeField = new FormControl();
  gradeField = new FormControl();
  gradeyearField = new FormControl();
  subjectField = new FormControl();
  teacherField = new FormControl();
  clsField = new FormControl();

  constructor(
    private gradeService: GradeService,
    private gradeyearService: GradeyearService,
    private subjectService: SubjectService,
    private employeeService: EmployeeService,
    private clsService: ClsService,
    private timetableService: TimetableService,
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
    pageRequest.addSearchCriteria('gradeyear', this.gradeyearField.value);
    pageRequest.addSearchCriteria('subject', this.subjectField.value);
    pageRequest.addSearchCriteria('teacher', this.teacherField.value);
    pageRequest.addSearchCriteria('cls', this.clsField.value);

    this.gradeService.getAll().then((grades) => {
      this.grades = grades;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gradeyearService.getAllBasic(new PageRequest()).then((gradeyearDataPage) => {
      this.gradeyears = gradeyearDataPage.content;
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
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.teachers = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.clsService.getAllBasic(new PageRequest()).then((clsDataPage) => {
      this.clses = clsDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.timetableService.getAll(pageRequest).then((page: TimetableDataPage) => {
      this.timetableDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TIMETABLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TIMETABLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TIMETABLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TIMETABLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TIMETABLE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'grade', 'gradeyear', 'subject', 'teacher', 'day', 'cls', 'tostart', 'toend'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(timetable: Timetable): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: timetable.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.timetableService.delete(timetable.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
