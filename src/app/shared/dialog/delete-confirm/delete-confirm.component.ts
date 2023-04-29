import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm',
  template: `
    <h1 mat-dialog-title>Delete confirmation</h1>
    <div mat-dialog-content>
      <p>Delete user?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button color="warn" [matDialogClose]="false">Cancel</button>
      <button mat-button color="primary" cdkFocusInitial (click)="dialogRef.close(true)">Confirm</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>) {}
}
