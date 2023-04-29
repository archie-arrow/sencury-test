import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInterface, UserRole } from '../../../core/interfaces/user.interface';
import { UserDataService } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  public form = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    givenName: new FormControl(''),
    familyName: new FormControl(''),
    userRoles: new FormControl<UserRole[]>([], Validators.required),
  });

  public userRoles = Object.values(UserRole);

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: UserInterface,
    private userDataService: UserDataService
  ) {
    this.form.patchValue(this.data);
    this.form.valueChanges.subscribe(() => console.log(this.form.getRawValue()))
  }

  public saveChanges(): void {
    if (this.form.invalid) return;

    const user = {
      ...this.data,
      ...this.form.getRawValue()
    } as UserInterface;

    this.userDataService.editUser(user);
    this.dialogRef.close(true);
  }
}
