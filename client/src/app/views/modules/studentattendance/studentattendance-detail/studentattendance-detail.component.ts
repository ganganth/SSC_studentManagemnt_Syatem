import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Studentattendance} from '../../../../entities/studentattendance';
import {StudentattendanceService} from '../../../../services/studentattendance.service';

@Component({
  selector: 'app-studentattendance-detail',
  templateUrl: './studentattendance-detail.component.html',
  styleUrls: ['./studentattendance-detail.component.scss']
})
export class StudentattendanceDetailComponent extends AbstractComponent implements OnInit {

  studentattendance: Studentattendance;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private studentattendanceService: StudentattendanceService,
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
      data: {message: this.studentattendance.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.studentattendanceService.delete(this.selectedId);
        await this.router.navigateByUrl('/studentattendances');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.studentattendance = await this.studentattendanceService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTATTENDANCE);
  }
}
