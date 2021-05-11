import { Component, Input, QueryList } from "@angular/core";
import { GraphComponent } from "./graph.component";
import { ContentChildren } from "@angular/core";
import { GraphEmbeddableDirective } from "./graph.embeddable.directive";
import { ObjectUtilsService } from "../../core/commons/services/object.utils.service";

@Component({
  selector: "graph-when",
  template: `
    <div *ngIf="show"><ng-content></ng-content></div>
  `
})
export class GraphWhenComponent {
  @ContentChildren(GraphEmbeddableDirective) embeddables: QueryList<GraphEmbeddableDirective>;

  @Input() depth = 0;

  private _show = false;

  constructor(private utils: ObjectUtilsService) {}

  @Input()
  set show(value) {
    this._show = value;
    this.runAware(value);
  }

  get show() {
    return this._show;
  }

  protected runAware(show: boolean): void {
    if (this.embeddables && this.embeddables.length > 0) {
      this.embeddables.forEach((dir: GraphEmbeddableDirective) => {
        const target: any = dir.hostComponent;
        if (show && target.onGraphWhenShow) {
          target.onGraphWhenShow();
        } else if (!show && target.onGraphWhenHide) {
          target.onGraphWhenHide();
        }
      });
    }
  }
}
