import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Cls} from '../../../../entities/cls';
import {ClsService} from '../../../../services/cls.service';

@Component({
  selector: 'app-cls-detail',
  templateUrl: './cls-detail.component.html',
  styleUrls: ['./cls-detail.component.scss']
})
export class ClsDetailComponent extends AbstractComponent implements OnInit {

  cls: Cls;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private clsService: ClsService,
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
      data: {message: this.cls.code + '-' + this.cls.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.clsService.delete(this.selectedId);
        await this.router.navigateByUrl('/clses');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.cls = await this.clsService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CLS);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CLSES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CLS_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CLS);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CLS);
  }
}
