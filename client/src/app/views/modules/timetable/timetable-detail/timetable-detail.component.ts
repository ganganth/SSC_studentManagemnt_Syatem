import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Timetable} from '../../../../entities/timetable';
import {TimetableService} from '../../../../services/timetable.service';

@Component({
  selector: 'app-timetable-detail',
  templateUrl: './timetable-detail.component.html',
  styleUrls: ['./timetable-detail.component.scss']
})
export class TimetableDetailComponent extends AbstractComponent implements OnInit {

  timetable: Timetable;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private timetableService: TimetableService,
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
      data: {message: this.timetable.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.timetableService.delete(this.selectedId);
        await this.router.navigateByUrl('/timetables');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.timetable = await this.timetableService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_TIMETABLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_TIMETABLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_TIMETABLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_TIMETABLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_TIMETABLE);
  }
}
