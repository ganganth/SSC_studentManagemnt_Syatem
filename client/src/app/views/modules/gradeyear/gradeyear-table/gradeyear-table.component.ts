import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Gradeyear, GradeyearDataPage} from '../../../../entities/gradeyear';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-gradeyear-table',
  templateUrl: './gradeyear-table.component.html',
  styleUrls: ['./gradeyear-table.component.scss']
})
export class GradeyearTableComponent extends AbstractComponent implements OnInit {

  gradeyearDataPage: GradeyearDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();

  constructor(
    private gradeyearService: GradeyearService,
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


    this.gradeyearService.getAll(pageRequest).then((page: GradeyearDataPage) => {
      this.gradeyearDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEYEAR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEYEARS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEYEAR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEYEAR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEYEAR);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'year', 'dostart', 'doend'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(gradeyear: Gradeyear): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: gradeyear.code + '-' + gradeyear.year}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.gradeyearService.delete(gradeyear.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
