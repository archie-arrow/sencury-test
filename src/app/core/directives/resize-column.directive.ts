import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[resizeColumn]',
})
export class ResizeColumnDirective implements OnInit {
  @Input('resizeColumn') public resizable = true;

  private column: HTMLElement;
  private table!: HTMLElement;

  private startX!: number;
  private startWidth!: number;
  private pressed!: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  public ngOnInit(): void {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement('span');
      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown.bind(this));
      this.renderer.listen(this.table, 'mousemove', this.onMouseMove.bind(this));
      this.renderer.listen('document', 'mouseup', this.onMouseUp.bind(this));
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  private onMouseMove(event: MouseEvent): void {
    const offset = 35;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, 'resizing');

      const width = this.startWidth + (event.pageX - this.startX - offset);

      this.renderer.setStyle(this.column, 'width', `${width}px`);
    }
  };

  private onMouseUp(): void {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };
}
