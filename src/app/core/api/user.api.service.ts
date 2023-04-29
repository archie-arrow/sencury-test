import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private usersUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(this.usersUrl);
  }

  public editUser(user: UserInterface): Observable<UserInterface> {
    return this.http.put<UserInterface>(`${this.usersUrl}/${user.id}`, user);
  }

  public deleteUser(userId: string): Observable<UserInterface> {
    return this.http.delete<UserInterface>(`${this.usersUrl}/${userId}`);
  }
}
