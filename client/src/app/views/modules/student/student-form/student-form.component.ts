import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Student} from '../../../../entities/student';
import {StudentService} from '../../../../services/student.service';
import {House} from '../../../../entities/house';
import {Gender} from '../../../../entities/gender';
import {Guardian} from '../../../../entities/guardian';
import {Religion} from '../../../../entities/religion';
import {Nametitle} from '../../../../entities/nametitle';
import {Bloodtype} from '../../../../entities/bloodtype';
import {Ethnicity} from '../../../../entities/ethnicity';
import {DateHelper} from '../../../../shared/date-helper';
import {HouseService} from '../../../../services/house.service';
import {GenderService} from '../../../../services/gender.service';
import {GuardianService} from '../../../../services/guardian.service';
import {ReligionService} from '../../../../services/religion.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {BloodtypeService} from '../../../../services/bloodtype.service';
import {EthnicityService} from '../../../../services/ethnicity.service';
import {Guardianrelationship} from '../../../../entities/guardianrelationship';
import {GuardianrelationshipService} from '../../../../services/guardianrelationship.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent extends AbstractComponent implements OnInit {

  nametitles: Nametitle[] = [];
  genders: Gender[] = [];
  guardians: Guardian[] = [];
  guardianrelationships: Guardianrelationship[] = [];
  bloodtypes: Bloodtype[] = [];
  religions: Religion[] = [];
  ethnicities: Ethnicity[] = [];
  houses: House[] = [];

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    photo: new FormControl(),
    birthcertificate: new FormControl(),
    dobirth: new FormControl(null, [
      Validators.required,
    ]),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    nic: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    guardian: new FormControl(null, [
    ]),
    guardianrelationship: new FormControl(null, [
    ]),
    bloodtype: new FormControl(null, [
    ]),
    religion: new FormControl(null, [
    ]),
    ethnicity: new FormControl(null, [
    ]),
    house: new FormControl(null, [
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
    joineddate: new FormControl(null, [
      Validators.required,
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    admissionfee: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
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

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get birthcertificateField(): FormControl{
    return this.form.controls.birthcertificate as FormControl;
  }

  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get guardianField(): FormControl{
    return this.form.controls.guardian as FormControl;
  }

  get guardianrelationshipField(): FormControl{
    return this.form.controls.guardianrelationship as FormControl;
  }

  get bloodtypeField(): FormControl{
    return this.form.controls.bloodtype as FormControl;
  }

  get religionField(): FormControl{
    return this.form.controls.religion as FormControl;
  }

  get ethnicityField(): FormControl{
    return this.form.controls.ethnicity as FormControl;
  }

  get houseField(): FormControl{
    return this.form.controls.house as FormControl;
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

  get joineddateField(): FormControl{
    return this.form.controls.joineddate as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get admissionfeeField(): FormControl{
    return this.form.controls.admissionfee as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private genderService: GenderService,
    private guardianService: GuardianService,
    private guardianrelationshipService: GuardianrelationshipService,
    private bloodtypeService: BloodtypeService,
    private religionService: ReligionService,
    private ethnicityService: EthnicityService,
    private houseService: HouseService,
    private studentService: StudentService,
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
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.guardianService.getAllBasic(new PageRequest()).then((guardianDataPage) => {
      this.guardians = guardianDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.guardianrelationshipService.getAll().then((guardianrelationships) => {
      this.guardianrelationships = guardianrelationships;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.bloodtypeService.getAll().then((bloodtypes) => {
      this.bloodtypes = bloodtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.religionService.getAll().then((religions) => {
      this.religions = religions;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.ethnicityService.getAll().then((ethnicities) => {
      this.ethnicities = ethnicities;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.houseService.getAll().then((houses) => {
      this.houses = houses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENT);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.birthcertificateField.updateValueAndValidity();
    this.birthcertificateField.markAsTouched();
    if (this.form.invalid) { return; }

    const student: Student = new Student();
    student.nametitle = this.nametitleField.value;
    student.callingname = this.callingnameField.value;
    student.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      student.photo = photoIds[0];
    }else{
      student.photo = null;
    }
    const birthcertificateIds = this.birthcertificateField.value;
    if (birthcertificateIds !== null && birthcertificateIds !== []){
      student.birthcertificate = birthcertificateIds[0];
    }else{
      student.birthcertificate = null;
    }
    student.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    student.gender = this.genderField.value;
    student.nic = this.nicField.value;
    student.guardian = this.guardianField.value;
    student.guardianrelationship = this.guardianrelationshipField.value;
    student.bloodtype = this.bloodtypeField.value;
    student.religion = this.religionField.value;
    student.ethnicity = this.ethnicityField.value;
    student.house = this.houseField.value;
    student.mobile = this.mobileField.value;
    student.land = this.landField.value;
    student.email = this.emailField.value;
    student.joineddate = DateHelper.getDateAsString(this.joineddateField.value);
    student.address = this.addressField.value;
    student.admissionfee = this.admissionfeeField.value;
    student.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentService.add(student);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/students/' + resourceLink.id);
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
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.birthcertificate) { this.birthcertificateField.setErrors({server: msg.birthcertificate}); knownError = true; }
          if (msg.dobirth) { this.dobirthField.setErrors({server: msg.dobirth}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.guardian) { this.guardianField.setErrors({server: msg.guardian}); knownError = true; }
          if (msg.guardianrelationship) { this.guardianrelationshipField.setErrors({server: msg.guardianrelationship}); knownError = true; }
          if (msg.bloodtype) { this.bloodtypeField.setErrors({server: msg.bloodtype}); knownError = true; }
          if (msg.religion) { this.religionField.setErrors({server: msg.religion}); knownError = true; }
          if (msg.ethnicity) { this.ethnicityField.setErrors({server: msg.ethnicity}); knownError = true; }
          if (msg.house) { this.houseField.setErrors({server: msg.house}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.joineddate) { this.joineddateField.setErrors({server: msg.joineddate}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.admissionfee) { this.admissionfeeField.setErrors({server: msg.admissionfee}); knownError = true; }
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
