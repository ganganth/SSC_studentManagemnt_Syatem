import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Materialissue} from '../../../../entities/materialissue';
import {MaterialissueService} from '../../../../services/materialissue.service';

@Component({
  selector: 'app-materialissue-detail',
  templateUrl: './materialissue-detail.component.html',
  styleUrls: ['./materialissue-detail.component.scss']
})
export class MaterialissueDetailComponent extends AbstractComponent implements OnInit {

  materialissue: Materialissue;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private materialissueService: MaterialissueService,
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
      data: {message: this.materialissue.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.materialissueService.delete(this.selectedId);
        await this.router.navigateByUrl('/materialissues');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.materialissue = await this.materialissueService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIALISSUE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALISSUES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIALISSUE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIALISSUE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIALISSUE);
  }
}
