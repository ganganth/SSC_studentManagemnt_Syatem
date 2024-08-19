import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Guardian} from '../../../../entities/guardian';
import {GuardianService} from '../../../../services/guardian.service';

@Component({
  selector: 'app-guardian-detail',
  templateUrl: './guardian-detail.component.html',
  styleUrls: ['./guardian-detail.component.scss']
})
export class GuardianDetailComponent extends AbstractComponent implements OnInit {

  guardian: Guardian;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private guardianService: GuardianService,
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
      data: {message: this.guardian.code + '-' + this.guardian.nametitle.name + ' ' + this.guardian.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.guardianService.delete(this.selectedId);
        await this.router.navigateByUrl('/guardians');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.guardian = await this.guardianService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUARDIAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUARDIANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUARDIAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUARDIAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUARDIAN);
  }
}
