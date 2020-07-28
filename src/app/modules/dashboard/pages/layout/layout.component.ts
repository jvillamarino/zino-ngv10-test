import { Component } from '@angular/core';
import { CreditService } from '@services/credit.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent  {
  public totalMoney: number = 0;
  constructor(private _creditService: CreditService) {}

  ngOnInit(): void {
    this._creditService.toltaMoney.subscribe(res => this.totalMoney = res);
  }

}
