import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserTableComponent } from './components/user-table/user-table.component';
import { ResizeColumnDirective } from './core/directives/resize-column.directive';
import { EditColumnsComponent } from './shared/dialog/edit-columns/edit-columns.component';
import { VerifyUserComponent } from './shared/dialog/verify-user/verify-user.component';
import { EditUserComponent } from './shared/dialog/edit-user/edit-user.component';
import { DeleteConfirmComponent } from './shared/dialog/delete-confirm/delete-confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    UserTableComponent,
    ResizeColumnDirective,
    EditColumnsComponent,
    VerifyUserComponent,
    EditUserComponent,
    DeleteConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
