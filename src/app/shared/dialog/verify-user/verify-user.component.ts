import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInterface } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-verify-user',
  template: `
      <h1 mat-dialog-title>Verify credentials</h1>
      <div mat-dialog-content>
          <form [formGroup]="form">
              <mat-form-field [ngStyle]="{ width: '100%', display: 'block' }">
                  <mat-label>Email</mat-label>
                  <input matInput placeholder="Email" type="text" formControlName="email">
              </mat-form-field>
              <mat-form-field [ngStyle]="{ width: '100%', display: 'block' }">
                  <mat-label>Password</mat-label>
                  <input matInput placeholder="Password" type="text" formControlName="password" (ngModelChange)="showError = false">
              </mat-form-field>
              <p class="mat-mdc-form-field-error" *ngIf="showError">Password incorrect, try again!</p>
          </form>
      </div>
      <div mat-dialog-actions>
          <button mat-button color="warn" [matDialogClose]="false">Cancel</button>
          <button mat-button color="primary" cdkFocusInitial (click)="checkCredentials()" [disabled]="form.invalid">Confirm</button>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyUserComponent implements OnInit {
  public form = new FormGroup({
    email: new FormControl({ value: '', disabled: true }),
    password: new FormControl('', Validators.required),
  });

  public showError = false;

  constructor(
    public dialogRef: MatDialogRef<VerifyUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: UserInterface,
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({ email: this.data.email });
  }

  public checkCredentials(): void {
    const formData = this.form.getRawValue();

    if (formData.password === this.data.password) {
      this.dialogRef.close(true);
    } else {
      this.form.controls.password.reset();
      this.showError = true;
    }
  }
}
