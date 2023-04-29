import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-user-table></app-user-table>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
