import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Gradeyear} from '../../../../entities/gradeyear';
import {GradeyearService} from '../../../../services/gradeyear.service';

@Component({
  selector: 'app-gradeyear-detail',
  templateUrl: './gradeyear-detail.component.html',
  styleUrls: ['./gradeyear-detail.component.scss']
})
export class GradeyearDetailComponent extends AbstractComponent implements OnInit {

  gradeyear: Gradeyear;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private gradeyearService: GradeyearService,
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
      data: {message: this.gradeyear.code + '-' + this.gradeyear.year}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.gradeyearService.delete(this.selectedId);
        await this.router.navigateByUrl('/gradeyears');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.gradeyear = await this.gradeyearService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GRADEYEAR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GRADEYEARS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GRADEYEAR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GRADEYEAR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GRADEYEAR);
  }
}
