import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '@shared/models/common';
import { map, toArray, flatMap, filter, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API: string = environment.urlApi;

  constructor(private _http: HttpClient) {}

  public createUser(user: User): Observable<any> {
    return this._http.post(`${this.API}/users`, user);
  }

  public getUser(user: User): Observable<User[]> {
    return this._http.get<User[]>(`${this.API}/users?DNI=${user.DNI}`);
  }

  public getUsers() {
    return this._http.get<User[]>(`${this.API}/users`).pipe(
      flatMap((res) => res),
      map((user: User) => ({
        ...user,
        FULL_NAME: `${user.NAME} ${user.SURNAME} ${user.SECOND_SURNAME}`,
      })),
      toArray()
    );
  }
}
