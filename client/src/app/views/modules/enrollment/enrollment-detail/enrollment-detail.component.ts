import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Enrollment} from '../../../../entities/enrollment';
import {EnrollmentService} from '../../../../services/enrollment.service';

@Component({
  selector: 'app-enrollment-detail',
  templateUrl: './enrollment-detail.component.html',
  styleUrls: ['./enrollment-detail.component.scss']
})
export class EnrollmentDetailComponent extends AbstractComponent implements OnInit {

  enrollment: Enrollment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private enrollmentService: EnrollmentService,
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
      data: {message: this.enrollment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.enrollmentService.delete(this.selectedId);
        await this.router.navigateByUrl('/enrollments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.enrollment = await this.enrollmentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ENROLLMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ENROLLMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ENROLLMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ENROLLMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ENROLLMENT);
  }
}
