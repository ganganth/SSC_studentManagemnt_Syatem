import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Lesson} from '../../../../entities/lesson';
import {LessonService} from '../../../../services/lesson.service';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.scss']
})
export class LessonDetailComponent extends AbstractComponent implements OnInit {

  lesson: Lesson;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private lessonService: LessonService,
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
      data: {message: this.lesson.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.lessonService.delete(this.selectedId);
        await this.router.navigateByUrl('/lessons');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.lesson = await this.lessonService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_LESSON);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_LESSONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_LESSON_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_LESSON);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_LESSON);
  }
}
