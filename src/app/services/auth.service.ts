import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLogged: boolean;

  constructor() {
    this._isLogged = false;
  }

  public validateUser(user: string, password: string): Observable<any> {
    let result: Observable<any> = of(false);
    if (user === 'admin' && password === 'admin') {
      result = of(true);
      this.isLogged = true;
    }
    return result;
  }

  public set isLogged(value: boolean) {
    this._isLogged = value;
  }

  public get isLogged(): boolean {
    return this._isLogged;
  }
}
