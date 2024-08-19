import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Discount} from '../../../../entities/discount';
import {DiscountService} from '../../../../services/discount.service';
import {Discounttype} from '../../../../entities/discounttype';
import {DiscounttypeService} from '../../../../services/discounttype.service';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.scss']
})
export class DiscountFormComponent extends AbstractComponent implements OnInit {

  discounttypes: Discounttype[] = [];

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

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private discounttypeService: DiscounttypeService,
    private discountService: DiscountService,
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

    this.discounttypeService.getAll().then((discounttypes) => {
      this.discounttypes = discounttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DISCOUNT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DISCOUNTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DISCOUNT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DISCOUNT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DISCOUNT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const discount: Discount = new Discount();
    discount.name = this.nameField.value;
    discount.fixedamount = this.fixedamountField.value;
    discount.percentage = this.percentageField.value;
    discount.discounttype = this.discounttypeField.value;
    discount.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.discountService.add(discount);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/discounts/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.fixedamount) { this.fixedamountField.setErrors({server: msg.fixedamount}); knownError = true; }
          if (msg.percentage) { this.percentageField.setErrors({server: msg.percentage}); knownError = true; }
          if (msg.discounttype) { this.discounttypeField.setErrors({server: msg.discounttype}); knownError = true; }
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
