import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Clssession} from '../../../../entities/clssession';
import {ClssessionService} from '../../../../services/clssession.service';

@Component({
  selector: 'app-clssession-detail',
  templateUrl: './clssession-detail.component.html',
  styleUrls: ['./clssession-detail.component.scss']
})
export class ClssessionDetailComponent extends AbstractComponent implements OnInit {

  clssession: Clssession;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private clssessionService: ClssessionService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.clssession.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.clssessionService.delete(this.selectedId);
        await this.router.navigateByUrl('/clssessions');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.clssession = await this.clssessionService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLSSESSION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSSESSIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLSSESSION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLSSESSION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLSSESSION);
  }
}
