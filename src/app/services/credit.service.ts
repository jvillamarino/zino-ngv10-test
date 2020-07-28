import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Credit } from '@shared/models/common';
import { reduce, flatMap, filter, toArray, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  private _totalMoney: BehaviorSubject<number>;
  private API: string = environment.urlApi;

  constructor(private _http: HttpClient) {
    this._totalMoney = new BehaviorSubject(environment.creditCapital);
    this.getTotalApproved();
  }

  public get toltaMoney(): BehaviorSubject<number> {
    return this._totalMoney;
  }

  public creditRequest(credit: Credit): Observable<any> {
    credit['STATUS'] = +(
      this.approvedCredit && this.validateCreditValue(credit.VALUE)
    );
    return this._http.post(`${this.API}/credits`, credit);
  }

  public getCreditByUser(DNI: string): Observable<Credit[]> {
    return this._http.get<Credit[]>(`${this.API}/credits?DNI=${DNI}`);
  }

  public decrementCredit(creditValue: number): void {
    this._totalMoney.next(this.toltaMoney.value - creditValue);
  }

  public getCredits(statusCredit: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.API}/credits?_expand=user`).pipe(
      flatMap((res) => res),
      map((element) => ({
        ...element,
        ...element.user,
        FULL_NAME: `${element.user.NAME} ${element.user.SURNAME} ${element.user.SECOND_SURNAME}`,
      })),
      filter((element) => element.STATUS === statusCredit),
      toArray()
    );
  }

  private getTotalApproved(): void {
    this._http
      .get<Credit[]>(`${this.API}/credits?STATUS=1`)
      .pipe(
        flatMap((res) => res),
        reduce((acc: number, credit: Credit) => acc + credit.VALUE, 0)
      )
      .subscribe((res) => this.decrementCredit(res));
  }

  private get approvedCredit() {
    return Math.floor(Math.random() * 2);
  }

  private validateCreditValue(creditValue) {
    return creditValue > 0 && creditValue < this.toltaMoney.value * 0.5;
  }
}
