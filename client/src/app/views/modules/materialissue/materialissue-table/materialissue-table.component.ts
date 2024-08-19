import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Materialissue, MaterialissueDataPage} from '../../../../entities/materialissue';
import {MaterialissueService} from '../../../../services/materialissue.service';
import {Cls} from '../../../../entities/cls';
import {Gradeyear} from '../../../../entities/gradeyear';
import {ClsService} from '../../../../services/cls.service';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-materialissue-table',
  templateUrl: './materialissue-table.component.html',
  styleUrls: ['./materialissue-table.component.scss']
})
export class MaterialissueTableComponent extends AbstractComponent implements OnInit {

  materialissueDataPage: MaterialissueDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  gradeyears: Gradeyear[] = [];
  clses: Cls[] = [];

  codeField = new FormControl();
  gradeyearField = new FormControl();
  clsField = new FormControl();

  constructor(
    private gradeyearService: GradeyearService,
    private clsService: ClsService,
    private materialissueService: MaterialissueService,
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
    pageRequest.addSearchCriteria('gradeyear', this.gradeyearField.value);
    pageRequest.addSearchCriteria('cls', this.clsField.value);

    this.gradeyearService.getAllBasic(new PageRequest()).then((gradeyearDataPage) => {
      this.gradeyears = gradeyearDataPage.content;
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

    this.materialissueService.getAll(pageRequest).then((page: MaterialissueDataPage) => {
      this.materialissueDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALISSUE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALISSUES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALISSUE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALISSUE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALISSUE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'student', 'material', 'gradeyear', 'cls', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(materialissue: Materialissue): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: materialissue.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.materialissueService.delete(materialissue.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
