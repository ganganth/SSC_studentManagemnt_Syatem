import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
  selector: 'app-guardian-update-form',
  templateUrl: './guardian-update-form.component.html',
  styleUrls: ['./guardian-update-form.component.scss']
})
export class GuardianUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  guardian: Guardian;

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
    this.guardian = await this.guardianService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUARDIAN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUARDIANS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUARDIAN_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUARDIAN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUARDIAN);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.guardian.nametitle.id);
    }
    if (this.callingnameField.pristine) {
      this.callingnameField.setValue(this.guardian.callingname);
    }
    if (this.civilstatusField.pristine) {
      this.civilstatusField.setValue(this.guardian.civilstatus.id);
    }
    if (this.fullnameField.pristine) {
      this.fullnameField.setValue(this.guardian.fullname);
    }
    if (this.genderField.pristine) {
      this.genderField.setValue(this.guardian.gender.id);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.guardian.nic);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.guardian.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.guardian.land);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.guardian.email);
    }
    if (this.occupationField.pristine) {
      this.occupationField.setValue(this.guardian.occupation);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.guardian.address);
    }
    if (this.officetel1Field.pristine) {
      this.officetel1Field.setValue(this.guardian.officetel1);
    }
    if (this.officetel2Field.pristine) {
      this.officetel2Field.setValue(this.guardian.officetel2);
    }
    if (this.officeaddressField.pristine) {
      this.officeaddressField.setValue(this.guardian.officeaddress);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.guardian.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newguardian: Guardian = new Guardian();
    newguardian.nametitle = this.nametitleField.value;
    newguardian.callingname = this.callingnameField.value;
    newguardian.civilstatus = this.civilstatusField.value;
    newguardian.fullname = this.fullnameField.value;
    newguardian.gender = this.genderField.value;
    newguardian.nic = this.nicField.value;
    newguardian.mobile = this.mobileField.value;
    newguardian.land = this.landField.value;
    newguardian.email = this.emailField.value;
    newguardian.occupation = this.occupationField.value;
    newguardian.address = this.addressField.value;
    newguardian.officetel1 = this.officetel1Field.value;
    newguardian.officetel2 = this.officetel2Field.value;
    newguardian.officeaddress = this.officeaddressField.value;
    newguardian.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.guardianService.update(this.selectedId, newguardian);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/guardians/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/guardians');
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
