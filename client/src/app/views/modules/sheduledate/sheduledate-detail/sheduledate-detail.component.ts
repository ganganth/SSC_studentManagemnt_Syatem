import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Sheduledate} from '../../../../entities/sheduledate';
import {SheduledateService} from '../../../../services/sheduledate.service';

@Component({
  selector: 'app-sheduledate-detail',
  templateUrl: './sheduledate-detail.component.html',
  styleUrls: ['./sheduledate-detail.component.scss']
})
export class SheduledateDetailComponent extends AbstractComponent implements OnInit {

  sheduledate: Sheduledate;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private sheduledateService: SheduledateService,
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
      data: {message: this.sheduledate.code + '-' + this.sheduledate.date}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.sheduledateService.delete(this.selectedId);
        await this.router.navigateByUrl('/sheduledates');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.sheduledate = await this.sheduledateService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SHEDULEDATE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SHEDULEDATES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SHEDULEDATE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SHEDULEDATE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SHEDULEDATE);
  }
}
