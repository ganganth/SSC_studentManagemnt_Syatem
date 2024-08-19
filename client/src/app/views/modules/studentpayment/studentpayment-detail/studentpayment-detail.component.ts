import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Studentpayment} from '../../../../entities/studentpayment';
import {StudentpaymentService} from '../../../../services/studentpayment.service';

@Component({
  selector: 'app-studentpayment-detail',
  templateUrl: './studentpayment-detail.component.html',
  styleUrls: ['./studentpayment-detail.component.scss']
})
export class StudentpaymentDetailComponent extends AbstractComponent implements OnInit {

  studentpayment: Studentpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private studentpaymentService: StudentpaymentService,
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
      data: {message: this.studentpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.studentpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/studentpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.studentpayment = await this.studentpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENTPAYMENT);
  }
}
