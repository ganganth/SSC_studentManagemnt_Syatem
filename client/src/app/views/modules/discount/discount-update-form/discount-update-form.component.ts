import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Discount} from '../../../../entities/discount';
import {DiscountService} from '../../../../services/discount.service';
import {Discounttype} from '../../../../entities/discounttype';
import {Discountstatus} from '../../../../entities/discountstatus';
import {DiscounttypeService} from '../../../../services/discounttype.service';
import {DiscountstatusService} from '../../../../services/discountstatus.service';

@Component({
  selector: 'app-discount-update-form',
  templateUrl: './discount-update-form.component.html',
  styleUrls: ['./discount-update-form.component.scss']
})
export class DiscountUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  discount: Discount;

  discounttypes: Discounttype[] = [];
  discountstatuses: Discountstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    fixedamount: new FormControl(null, [
      Validators.min(0),
      Validators.max(99999999),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    percentage: new FormControl(null, [
      Validators.min(0),
      Validators.max(100),
      Validators.pattern('^([0-9]{1,3}([.][0-9]{1,2})?)$'),
    ]),
    discounttype: new FormControl(null, [
      Validators.required,
    ]),
    discountstatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get fixedamountField(): FormControl{
    return this.form.controls.fixedamount as FormControl;
  }

  get percentageField(): FormControl{
    return this.form.controls.percentage as FormControl;
  }

  get discounttypeField(): FormControl{
    return this.form.controls.discounttype as FormControl;
  }

  get discountstatusField(): FormControl{
    return this.form.controls.discountstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private discounttypeService: DiscounttypeService,
    private discountstatusService: DiscountstatusService,
    private discountService: DiscountService,
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

    this.discounttypeService.getAll().then((discounttypes) => {
      this.discounttypes = discounttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.discountstatusService.getAll().then((discountstatuses) => {
      this.discountstatuses = discountstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.discount = await this.discountService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCOUNT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCOUNTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCOUNT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCOUNT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCOUNT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.discount.name);
    }
    if (this.fixedamountField.pristine) {
      this.fixedamountField.setValue(this.discount.fixedamount);
    }
    if (this.percentageField.pristine) {
      this.percentageField.setValue(this.discount.percentage);
    }
    if (this.discounttypeField.pristine) {
      this.discounttypeField.setValue(this.discount.discounttype.id);
    }
    if (this.discountstatusField.pristine) {
      this.discountstatusField.setValue(this.discount.discountstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.discount.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newdiscount: Discount = new Discount();
    newdiscount.name = this.nameField.value;
    newdiscount.fixedamount = this.fixedamountField.value;
    newdiscount.percentage = this.percentageField.value;
    newdiscount.discounttype = this.discounttypeField.value;
    newdiscount.discountstatus = this.discountstatusField.value;
    newdiscount.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.discountService.update(this.selectedId, newdiscount);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/discounts/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/discounts');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.fixedamount) { this.fixedamountField.setErrors({server: msg.fixedamount}); knownError = true; }
          if (msg.percentage) { this.percentageField.setErrors({server: msg.percentage}); knownError = true; }
          if (msg.discounttype) { this.discounttypeField.setErrors({server: msg.discounttype}); knownError = true; }
          if (msg.discountstatus) { this.discountstatusField.setErrors({server: msg.discountstatus}); knownError = true; }
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
