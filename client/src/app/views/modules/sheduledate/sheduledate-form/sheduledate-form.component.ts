import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Sheduledate} from '../../../../entities/sheduledate';
import {SheduledateService} from '../../../../services/sheduledate.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Sheduledatestatus} from '../../../../entities/sheduledatestatus';
import {SheduledatestatusService} from '../../../../services/sheduledatestatus.service';

@Component({
  selector: 'app-sheduledate-form',
  templateUrl: './sheduledate-form.component.html',
  styleUrls: ['./sheduledate-form.component.scss']
})
export class SheduledateFormComponent extends AbstractComponent implements OnInit {

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
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.sheduledatestatusService.getAll().then((sheduledatestatuses) => {
      this.scheduledatestatuses = sheduledatestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SHEDULEDATE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SHEDULEDATES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SHEDULEDATE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SHEDULEDATE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SHEDULEDATE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const sheduledate: Sheduledate = new Sheduledate();
    sheduledate.date = DateHelper.getDateAsString(this.dateField.value);
    sheduledate.tostart = this.tostartField.value;
    sheduledate.toend = this.toendField.value;
    sheduledate.scheduledatestatus = this.scheduledatestatusField.value;
    sheduledate.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.sheduledateService.add(sheduledate);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/sheduledates/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
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
