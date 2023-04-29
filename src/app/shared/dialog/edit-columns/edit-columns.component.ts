import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface TableColumnsConfigInterface {
  name: string;
  isShown: boolean;
}

@Component({
  selector: 'app-edit-columns',
  template: `
    <h1 mat-dialog-title>Table columns settings</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <section *ngFor="let column of data">
          <mat-checkbox [formControlName]="column.name">
            {{ column.name }}
          </mat-checkbox>
        </section>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button [matDialogClose]="null">Cancel</button>
      <button mat-button cdkFocusInitial (click)="saveChanges()">Save</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditColumnsComponent implements OnInit {
  public form = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<EditColumnsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TableColumnsConfigInterface[],
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public saveChanges(): void {
    const formData = this.form.getRawValue();
    const entries = Object.entries(formData);
    const columns = entries.filter(([key, value]) => value).map(([key]) => key);

    this.dialogRef.close(columns);
  }

  private initForm(): void {
    this.data.forEach((column: TableColumnsConfigInterface) => {
      this.form.addControl(column.name, new FormControl(column.isShown));
    });
  }
}
