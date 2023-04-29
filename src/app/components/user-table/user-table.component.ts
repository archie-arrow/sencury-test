import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, startWith, switchMap, take, tap } from 'rxjs';
import { UserInterface, UserRole } from '../../core/interfaces/user.interface';
import { UserDataService } from '../../core/services/user-data.service';
import { DeleteConfirmComponent } from '../../shared/dialog/delete-confirm/delete-confirm.component';
import {
  EditColumnsComponent,
  TableColumnsConfigInterface,
} from '../../shared/dialog/edit-columns/edit-columns.component';
import { EditUserComponent } from '../../shared/dialog/edit-user/edit-user.component';
import { VerifyUserComponent } from '../../shared/dialog/verify-user/verify-user.component';

export type UserTableColumn = keyof UserInterface | 'actions';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public form = new FormGroup({
    givenName: new FormControl(''),
    familyName: new FormControl(''),
    userRoles: new FormControl<UserRole[]>([], Validators.required),
  });

  public filterForm = new FormGroup({
    userRole: new FormControl<UserRole[]>([]),
    name: new FormControl('')
  });

  public users$ = this.userDataService.users$.pipe(filter(Boolean));

  public dataSource$ = this.filterForm.valueChanges.pipe(
    startWith({ userRole: [], name: '' }),
    switchMap((filters) => this.users$.pipe(
      map((users: UserInterface[]) => new MatTableDataSource<UserInterface>(users || [])),
      tap((dataSource: MatTableDataSource<UserInterface>) => {
        dataSource.paginator = this.paginator;
        dataSource.sort = this.sort;
        dataSource.filterPredicate = this._filterPredicate.bind(this);
        dataSource.filter = Object.entries(filters).toString();
      }))
    )
  );

  public _columns: UserTableColumn[] = ['userName', 'email', 'givenName', 'familyName' ,'userRoles', 'actions'];
  public displayedColumns: UserTableColumn[] = [...this._columns];

  public rowToEdit: UserInterface | null = null;
  public userRoles = Object.values(UserRole);

  constructor(
    private userDataService: UserDataService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.userDataService.loadUsers();
  }

  public deleteUser(id: string): void {
    const ref = this.dialog.open(DeleteConfirmComponent);

    ref.afterClosed().pipe(take(1)).subscribe((result: boolean) => {
      if (result) {
        this.userDataService.deleteUser(id);
      }
    });
  }

  public verifyUser(user: UserInterface, cb = (user: UserInterface) => {}, error = () => {}): void {
    const ref = this.dialog.open(VerifyUserComponent, { data: user, width: '400px' });

    ref.afterClosed().pipe(take(1)).subscribe((result: boolean) => {
      if (result) {
        cb(user);
      } else {
        error();
      }
    });
  }

  public openEditUserDialog(user: UserInterface): void {
    this.dialog.open(EditUserComponent, { data: user });
  }

  public openColumnSettingDialog(): void {
    const data: TableColumnsConfigInterface[] = this._columns.map((value: UserTableColumn) => ({
      name: value,
      isShown: this.displayedColumns.includes(value),
    }));

    const ref = this.dialog.open(EditColumnsComponent, { data });

    ref.afterClosed().pipe(take(1)).subscribe((columns: UserTableColumn[] | null) => {
      if (columns) {
        this.displayedColumns = [...columns];
        this.cdr.detectChanges();
      }
    });
  }

  public inlineEdit(user: UserInterface): void {
    this.rowToEdit = user;
    this.form.patchValue(user);
    this.cdr.detectChanges();
  }

  public save(): void {
    if (this.form.invalid) return;

    const user = {
      ...this.rowToEdit,
      ...this.form.getRawValue()
    } as UserInterface;

    this.userDataService.editUser(user);

    this.rowToEdit = null;
  }

  private _filterPredicate(data: UserInterface): boolean {
    const filters = this.filterForm.getRawValue();
    const nameFilter = filters.name?.trim().toLowerCase() || '';
    const rolesFilter = filters.userRole || [];

    const fullName = `${data.userName} ${data.familyName}`.trim().toLowerCase();
    const containRoles = rolesFilter.every((roleFilter: UserRole) => {
      return data.userRoles.includes(roleFilter);
    });

    return fullName.includes(nameFilter) && containRoles;
  }
}
