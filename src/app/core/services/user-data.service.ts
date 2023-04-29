import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { UserApiService } from '../api/user.api.service';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private readonly _users$ = new BehaviorSubject<UserInterface[]>([]);
  private readonly _isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private userApiService: UserApiService) {}

  public get users$(): Observable<UserInterface[]> {
    return this._users$.asObservable();
  }

  public get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public loadUsers(): void {
    this._isLoading$.next(true);

    this.userApiService.getUsers()
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe((data: UserInterface[]) => this._users$.next(data))
  }

  public deleteUser(id: string): void {
    this._isLoading$.next(true);

    this.userApiService.deleteUser(id)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe(() => {
        const users = this._users$.getValue();
        const newUsers = users.filter((user: UserInterface) => user.id !== id);
        this._users$.next(newUsers);
      });
  }

  public editUser(data: UserInterface): void {
    this._isLoading$.next(true);

    this.userApiService.editUser(data)
      .pipe(finalize(() => this._isLoading$.next(false)))
      .subscribe(() => {
        const users = this._users$.getValue();
        const newUsers = users.map((user: UserInterface) => user.id !== data.id ? user : data);
        this._users$.next(newUsers);
      });
  }
}
