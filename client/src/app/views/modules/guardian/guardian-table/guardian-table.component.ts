import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Guardian, GuardianDataPage} from '../../../../entities/guardian';
import {GuardianService} from '../../../../services/guardian.service';

@Component({
  selector: 'app-guardian-table',
  templateUrl: './guardian-table.component.html',
  styleUrls: ['./guardian-table.component.scss']
})
export class GuardianTableComponent extends AbstractComponent implements OnInit {

  guardianDataPage: GuardianDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  callingnameField = new FormControl();
  nicField = new FormControl();

  constructor(
    private guardianService: GuardianService,
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


    this.guardianService.getAll(pageRequest).then((page: GuardianDataPage) => {
      this.guardianDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUARDIAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUARDIANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUARDIAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUARDIAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUARDIAN);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'callingname', 'nic'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(guardian: Guardian): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: guardian.code + '-' + guardian.nametitle.name + ' ' + guardian.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.guardianService.delete(guardian.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
