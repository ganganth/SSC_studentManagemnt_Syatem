import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Guardian} from '../../../../entities/guardian';
import {GuardianService} from '../../../../services/guardian.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {Civilstatus} from '../../../../entities/civilstatus';
import {GenderService} from '../../../../services/gender.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';

@Component({
  selector: 'app-guardian-form',
  templateUrl: './guardian-form.component.html',
  styleUrls: ['./guardian-form.component.scss']
})
export class GuardianFormComponent extends AbstractComponent implements OnInit {

  nametitles: Nametitle[] = [];
  civilstatuses: Civilstatus[] = [];
  genders: Gender[] = [];

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    civilstatus: new FormControl(null, [
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    gender: new FormControl(null, [
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$'),
    ]),
    occupation: new FormControl(null, [
      Validators.minLength(4),
      Validators.maxLength(255),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    officetel1: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    officetel2: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    officeaddress: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
  }

  get civilstatusField(): FormControl{
    return this.form.controls.civilstatus as FormControl;
  }

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get occupationField(): FormControl{
    return this.form.controls.occupation as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get officetel1Field(): FormControl{
    return this.form.controls.officetel1 as FormControl;
  }

  get officetel2Field(): FormControl{
    return this.form.controls.officetel2 as FormControl;
  }

  get officeaddressField(): FormControl{
    return this.form.controls.officeaddress as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private civilstatusService: CivilstatusService,
    private genderService: GenderService,
    private guardianService: GuardianService,
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

    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.civilstatusService.getAll().then((civilstatuses) => {
      this.civilstatuses = civilstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUARDIAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUARDIANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUARDIAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUARDIAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUARDIAN);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const guardian: Guardian = new Guardian();
    guardian.nametitle = this.nametitleField.value;
    guardian.callingname = this.callingnameField.value;
    guardian.civilstatus = this.civilstatusField.value;
    guardian.fullname = this.fullnameField.value;
    guardian.gender = this.genderField.value;
    guardian.nic = this.nicField.value;
    guardian.mobile = this.mobileField.value;
    guardian.land = this.landField.value;
    guardian.email = this.emailField.value;
    guardian.occupation = this.occupationField.value;
    guardian.address = this.addressField.value;
    guardian.officetel1 = this.officetel1Field.value;
    guardian.officetel2 = this.officetel2Field.value;
    guardian.officeaddress = this.officeaddressField.value;
    guardian.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.guardianService.add(guardian);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/guardians/' + resourceLink.id);
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
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.callingname) { this.callingnameField.setErrors({server: msg.callingname}); knownError = true; }
          if (msg.civilstatus) { this.civilstatusField.setErrors({server: msg.civilstatus}); knownError = true; }
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.occupation) { this.occupationField.setErrors({server: msg.occupation}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.officetel1) { this.officetel1Field.setErrors({server: msg.officetel1}); knownError = true; }
          if (msg.officetel2) { this.officetel2Field.setErrors({server: msg.officetel2}); knownError = true; }
          if (msg.officeaddress) { this.officeaddressField.setErrors({server: msg.officeaddress}); knownError = true; }
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
