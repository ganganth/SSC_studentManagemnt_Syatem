import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Sheduledate} from '../../../../entities/sheduledate';
import {SheduledateService} from '../../../../services/sheduledate.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Sheduledatestatus} from '../../../../entities/sheduledatestatus';
import {SheduledatestatusService} from '../../../../services/sheduledatestatus.service';

@Component({
  selector: 'app-sheduledate-update-form',
  templateUrl: './sheduledate-update-form.component.html',
  styleUrls: ['./sheduledate-update-form.component.scss']
})
export class SheduledateUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  sheduledate: Sheduledate;

  scheduledatestatuses: Sheduledatestatus[] = [];

  form = new FormGroup({
    date: new FormControl(null, [
      Validators.required,
    ]),
    tostart: new FormControl(null, [
      Validators.required,
    ]),
    toend: new FormControl(null, [
      Validators.required,
    ]),
    scheduledatestatus: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get tostartField(): FormControl{
    return this.form.controls.tostart as FormControl;
  }

  get toendField(): FormControl{
    return this.form.controls.toend as FormControl;
  }

  get scheduledatestatusField(): FormControl{
    return this.form.controls.scheduledatestatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private sheduledatestatusService: SheduledatestatusService,
    private sheduledateService: SheduledateService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.sheduledatestatusService.getAll().then((sheduledatestatuses) => {
      this.scheduledatestatuses = sheduledatestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.sheduledate = await this.sheduledateService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SHEDULEDATE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SHEDULEDATES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SHEDULEDATE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SHEDULEDATE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SHEDULEDATE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.dateField.pristine) {
      this.dateField.setValue(this.sheduledate.date);
    }
    if (this.tostartField.pristine) {
      this.tostartField.setValue(this.sheduledate.tostart);
    }
    if (this.toendField.pristine) {
      this.toendField.setValue(this.sheduledate.toend);
    }
    if (this.scheduledatestatusField.pristine) {
      this.scheduledatestatusField.setValue(this.sheduledate.scheduledatestatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.sheduledate.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newsheduledate: Sheduledate = new Sheduledate();
    newsheduledate.date = DateHelper.getDateAsString(this.dateField.value);
    newsheduledate.tostart = this.tostartField.value;
    newsheduledate.toend = this.toendField.value;
    newsheduledate.scheduledatestatus = this.scheduledatestatusField.value;
    newsheduledate.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.sheduledateService.update(this.selectedId, newsheduledate);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/sheduledates/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/sheduledates');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.tostart) { this.tostartField.setErrors({server: msg.tostart}); knownError = true; }
          if (msg.toend) { this.toendField.setErrors({server: msg.toend}); knownError = true; }
          if (msg.scheduledatestatus) { this.scheduledatestatusField.setErrors({server: msg.scheduledatestatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
