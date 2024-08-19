import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Material, MaterialDataPage} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Lesson} from '../../../../entities/lesson';
import {Subject} from '../../../../entities/subject';
import {LessonService} from '../../../../services/lesson.service';
import {Materialmedium} from '../../../../entities/materialmedium';
import {Materialstatus} from '../../../../entities/materialstatus';
import {SubjectService} from '../../../../services/subject.service';
import {MaterialmediumService} from '../../../../services/materialmedium.service';
import {MaterialstatusService} from '../../../../services/materialstatus.service';

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent extends AbstractComponent implements OnInit {

  materialDataPage: MaterialDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  subjects: Subject[] = [];
  lessons: Lesson[] = [];
  materialmediums: Materialmedium[] = [];
  materialstatuses: Materialstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  subjectField = new FormControl();
  lessonField = new FormControl();
  materialmediumField = new FormControl();
  materialstatusField = new FormControl();

  constructor(
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private materialmediumService: MaterialmediumService,
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
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
    pageRequest.addSearchCriteria('subject', this.subjectField.value);
    pageRequest.addSearchCriteria('lesson', this.lessonField.value);
    pageRequest.addSearchCriteria('materialmedium', this.materialmediumField.value);
    pageRequest.addSearchCriteria('materialstatus', this.materialstatusField.value);

    this.subjectService.getAllBasic(new PageRequest()).then((subjectDataPage) => {
      this.subjects = subjectDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.lessonService.getAllBasic(new PageRequest()).then((lessonDataPage) => {
      this.lessons = lessonDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialmediumService.getAll().then((materialmediums) => {
      this.materialmediums = materialmediums;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.materialService.getAll(pageRequest).then((page: MaterialDataPage) => {
      this.materialDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'subject', 'lesson', 'materialmedium', 'materialstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(material: Material): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: material.code + '-' + material.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.materialService.delete(material.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
