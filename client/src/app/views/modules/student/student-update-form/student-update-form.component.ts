import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
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
import {Studentstatus} from '../../../../entities/studentstatus';
import {GenderService} from '../../../../services/gender.service';
import {GuardianService} from '../../../../services/guardian.service';
import {ReligionService} from '../../../../services/religion.service';
import {NametitleService} from '../../../../services/nametitle.service';
import {BloodtypeService} from '../../../../services/bloodtype.service';
import {EthnicityService} from '../../../../services/ethnicity.service';
import {Guardianrelationship} from '../../../../entities/guardianrelationship';
import {StudentstatusService} from '../../../../services/studentstatus.service';
import {GuardianrelationshipService} from '../../../../services/guardianrelationship.service';

@Component({
  selector: 'app-student-update-form',
  templateUrl: './student-update-form.component.html',
  styleUrls: ['./student-update-form.component.scss']
})
export class StudentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  student: Student;

  nametitles: Nametitle[] = [];
  genders: Gender[] = [];
  guardians: Guardian[] = [];
  guardianrelationships: Guardianrelationship[] = [];
  bloodtypes: Bloodtype[] = [];
  religions: Religion[] = [];
  ethnicities: Ethnicity[] = [];
  houses: House[] = [];
  studentstatuses: Studentstatus[] = [];

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
    studentstatus: new FormControl('1', [
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

  get studentstatusField(): FormControl{
    return this.form.controls.studentstatus as FormControl;
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
    private studentstatusService: StudentstatusService,
    private studentService: StudentService,
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
    this.studentstatusService.getAll().then((studentstatuses) => {
      this.studentstatuses = studentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.student = await this.studentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_STUDENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_STUDENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_STUDENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_STUDENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_STUDENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.student.nametitle.id);
    }
    if (this.callingnameField.pristine) {
      this.callingnameField.setValue(this.student.callingname);
    }
    if (this.fullnameField.pristine) {
      this.fullnameField.setValue(this.student.fullname);
    }
    if (this.photoField.pristine) {
      if (this.student.photo) { this.photoField.setValue([this.student.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.birthcertificateField.pristine) {
      if (this.student.birthcertificate) { this.birthcertificateField.setValue([this.student.birthcertificate]); }
      else { this.birthcertificateField.setValue([]); }
    }
    if (this.dobirthField.pristine) {
      this.dobirthField.setValue(this.student.dobirth);
    }
    if (this.genderField.pristine) {
      this.genderField.setValue(this.student.gender.id);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.student.nic);
    }
    if (this.guardianField.pristine) {
      this.guardianField.setValue(this.student.guardian.id);
    }
    if (this.guardianrelationshipField.pristine) {
      this.guardianrelationshipField.setValue(this.student.guardianrelationship.id);
    }
    if (this.bloodtypeField.pristine) {
      this.bloodtypeField.setValue(this.student.bloodtype.id);
    }
    if (this.religionField.pristine) {
      this.religionField.setValue(this.student.religion.id);
    }
    if (this.ethnicityField.pristine) {
      this.ethnicityField.setValue(this.student.ethnicity.id);
    }
    if (this.houseField.pristine) {
      this.houseField.setValue(this.student.house.id);
    }
    if (this.studentstatusField.pristine) {
      this.studentstatusField.setValue(this.student.studentstatus.id);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.student.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.student.land);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.student.email);
    }
    if (this.joineddateField.pristine) {
      this.joineddateField.setValue(this.student.joineddate);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.student.address);
    }
    if (this.admissionfeeField.pristine) {
      this.admissionfeeField.setValue(this.student.admissionfee);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.student.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.birthcertificateField.updateValueAndValidity();
    this.birthcertificateField.markAsTouched();
    if (this.form.invalid) { return; }

    const newstudent: Student = new Student();
    newstudent.nametitle = this.nametitleField.value;
    newstudent.callingname = this.callingnameField.value;
    newstudent.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newstudent.photo = photoIds[0];
    }else{
      newstudent.photo = null;
    }
    const birthcertificateIds = this.birthcertificateField.value;
    if (birthcertificateIds !== null && birthcertificateIds !== []){
      newstudent.birthcertificate = birthcertificateIds[0];
    }else{
      newstudent.birthcertificate = null;
    }
    newstudent.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    newstudent.gender = this.genderField.value;
    newstudent.nic = this.nicField.value;
    newstudent.guardian = this.guardianField.value;
    newstudent.guardianrelationship = this.guardianrelationshipField.value;
    newstudent.bloodtype = this.bloodtypeField.value;
    newstudent.religion = this.religionField.value;
    newstudent.ethnicity = this.ethnicityField.value;
    newstudent.house = this.houseField.value;
    newstudent.studentstatus = this.studentstatusField.value;
    newstudent.mobile = this.mobileField.value;
    newstudent.land = this.landField.value;
    newstudent.email = this.emailField.value;
    newstudent.joineddate = DateHelper.getDateAsString(this.joineddateField.value);
    newstudent.address = this.addressField.value;
    newstudent.admissionfee = this.admissionfeeField.value;
    newstudent.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.studentService.update(this.selectedId, newstudent);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/students/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/students');
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
          if (msg.studentstatus) { this.studentstatusField.setErrors({server: msg.studentstatus}); knownError = true; }
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
