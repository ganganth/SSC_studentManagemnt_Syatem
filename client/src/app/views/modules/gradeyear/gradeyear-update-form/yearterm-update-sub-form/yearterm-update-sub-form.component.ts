import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Yearterm} from '../../../../../entities/yearterm';
import {Payscheme} from '../../../../../entities/payscheme';
import {DateHelper} from '../../../../../shared/date-helper';
import {PayschemeService} from '../../../../../services/payscheme.service';

@Component({
  selector: 'app-yearterm-update-sub-form',
  templateUrl: './yearterm-update-sub-form.component.html',
  styleUrls: ['./yearterm-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YeartermUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => YeartermUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class YeartermUpdateSubFormComponent extends AbstractSubFormComponent<Yearterm> implements OnInit{

  payschemes: Payscheme[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    payscheme: new FormControl(),
    date: new FormControl(),
    fee: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get payschemeField(): FormControl{
    return this.form.controls.payscheme as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get feeField(): FormControl{
    return this.form.controls.fee as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.payschemeField)
      &&   this.isEmptyField(this.dateField)
      &&   this.isEmptyField(this.feeField);
  }

  constructor(
    private payschemeService: PayschemeService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.payschemeService.getAll().then((payschemes) => {
      this.payschemes = payschemes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.dateField.setValidators([Validators.required]);
    this.feeField.setValidators([
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(999999999),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.payschemeField.clearValidators();
    this.dateField.clearValidators();
    this.feeField.clearValidators();
  }

  fillForm(dataItem: Yearterm): void {
    this.idField.patchValue(dataItem.id);
    this.payschemeField.patchValue(dataItem.payscheme.id);
    this.dateField.patchValue(dataItem.date);
    this.feeField.patchValue(dataItem.fee);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(yearterm: Yearterm): string {
    return 'Are you sure to remove \u201C ' + yearterm.id + ' \u201D from yar term payments?';
  }

  getUpdateConfirmMessage(yearterm: Yearterm): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + yearterm.id + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + yearterm.id + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Yearterm = new Yearterm();
    dataItem.id = this.idField.value;

    for (const payscheme of this.payschemes){
      if (this.payschemeField.value === payscheme.id) {
        dataItem.payscheme = payscheme;
        break;
      }
    }

    dataItem.date = DateHelper.getDateAsString(this.dateField.value);
    dataItem.fee = this.feeField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
