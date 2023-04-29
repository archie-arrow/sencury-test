import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, take, tap } from 'rxjs';
import { UserInterface } from '../../core/interfaces/user.interface';
import { UserDataService } from '../../core/services/user-data.service';
import {
  EditColumnsComponent,
  TableColumnsConfigInterface,
} from '../../shared/dialog/edit-columns/edit-columns.component';

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

  public users$ = this.userDataService.users$.pipe(filter(Boolean));
  public dataSource$ = this.users$.pipe(
    map((users: UserInterface[]) => new MatTableDataSource<UserInterface>(users || [])),
    tap((dataSource: MatTableDataSource<UserInterface>) => {
      dataSource.paginator = this.paginator;
      dataSource.sort = this.sort;
    }),
  );

  private _columns: UserTableColumn[] = ['userName', 'email', 'givenName', 'familyName' ,'userRoles', 'actions'];
  public displayedColumns: UserTableColumn[] = [...this._columns];

  constructor(
    private userDataService: UserDataService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.userDataService.loadUsers();
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
}
