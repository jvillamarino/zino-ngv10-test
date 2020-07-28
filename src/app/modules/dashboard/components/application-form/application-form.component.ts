import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Options, LabelType } from 'ng5-slider';
import { CreditService } from '@services/credit.service';
import { UserService } from '@services/user.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import { Credit, User } from '@shared/models/common';
import { error } from '@angular/compiler/src/util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  providers: [CurrencyPipe],
})
export class ApplicationFormComponent implements OnInit {
  form = this._fb.group({
    DNI: ['', Validators.required],
    NAME: ['', Validators.required],
    SURNAME: ['', Validators.required],
    SECOND_SURNAME: ['', Validators.required],
    EMAIL: ['', Validators.required],
    PAYMENT_DATE: [''],
  });

  minValue: number = 0;
  maxValue: number = 100000;
  value: number = 100000;
  options: Options = {
    floor: 10000,
    ceil: 0,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return `<b>Monto:</b>${this._currency.transform(
            value,
            'USD',
            'symbol-narrow'
          )}`;
        case LabelType.High:
          return `<b>Max:</b>${this._currency.transform(
            value,
            'USD',
            'symbol-narrow'
          )}`;
        default:
          return `${this._currency.transform(value, 'USD', 'symbol-narrow')}`;
      }
    },
  };

  constructor(
    public dialogRef: MatDialogRef<ApplicationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _creditService: CreditService,
    private _userService: UserService,
    private _currency: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this._creditService.toltaMoney.subscribe((res) => {
      this.options.ceil = res;
    });
  }

  createRequest() {
    let paymentDate = null;
    if (this.form.get('PAYMENT_DATE').value) {
      paymentDate = formatDate(
        this.form.get('PAYMENT_DATE').value,
        'dd/MM/yyyy',
        'es-CO'
      );
    }
    const USER: User = this.form.value;
    let credit: Credit = {
      PAYMENT_DATE: paymentDate,
      DNI: USER.DNI,
      VALUE: this.value,
      IS_PAID: null,
    };

    this._userService.getUser(USER).subscribe((res) => {
      if (res?.length > 0) {
        credit['userId'] = res[0]['id'];
        this.createCreditRequest(credit);
      } else {
        this._userService.createUser(USER).subscribe(
          (res) => {
            credit['userId'] = res['id'];
            this.createCreditRequest(credit);
          },
          (error) => this.swalErrorMessage()
        );
      }
    });
  }

  private createCreditRequest(credit: Credit) {
    this._creditService.creditRequest(credit).subscribe((res: Credit) => {
      res.STATUS && this._creditService.decrementCredit(res.VALUE);
      Swal.fire(
        'Creación Exitosa',
        `Su crédito fue: ${res.STATUS ? 'Aprobado' : 'Rechazado'}`,
        res.STATUS ? 'success' : 'error'
      ).then((res) => this.dialogRef.close());
    });
  }

  private swalErrorMessage(text: string = '¡Ha ocurrido un error!'): void {
    Swal.fire('Ooopss!! 😐', text, 'error');
  }

  onNoClick(): void {
    this.dialogRef.close('resultado');
  }
}
