import { Component, Input } from "@angular/core";

@Component({
  selector: "graph-default",
  template: `
    <div *ngIf="show"><ng-content></ng-content></div>
  `
})
export class GraphDefaultComponent {
  @Input() show = true;
}
