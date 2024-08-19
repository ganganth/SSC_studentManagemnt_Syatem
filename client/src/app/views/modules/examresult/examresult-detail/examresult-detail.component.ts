import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Examresult} from '../../../../entities/examresult';
import {ExamresultService} from '../../../../services/examresult.service';

@Component({
  selector: 'app-examresult-detail',
  templateUrl: './examresult-detail.component.html',
  styleUrls: ['./examresult-detail.component.scss']
})
export class ExamresultDetailComponent extends AbstractComponent implements OnInit {

  examresult: Examresult;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private examresultService: ExamresultService,
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
      data: {message: this.examresult.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.examresultService.delete(this.selectedId);
        await this.router.navigateByUrl('/examresults');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.examresult = await this.examresultService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EXAMRESULT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EXAMRESULTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EXAMRESULT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EXAMRESULT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EXAMRESULT);
  }
}
