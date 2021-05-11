import { OnInit, Input, Component } from "@angular/core";
import { ViewChildren, ContentChildren, ViewChild } from "@angular/core";
import { GraphEmbeddableAware } from "./graph.embeddable.aware";

@Component({
  selector: "test-graph-inline-component",
  template: `
  <div>Inline component with id {{id}} </div>
  `
})
export class TestGraphInlineComponent implements OnInit, GraphEmbeddableAware {
  private _id: string;

  ngOnInit(): void {
    console.log("TestGraphInlineComponent.ngOnInit");
  }

  @Input()
  set id(value: string) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  onGraphWhenShow() {
    console.log(`[${this._id}] - TestGraphInlineComponent.onGraphWhenShow`);
  }
  onGraphWhenHide() {
    console.log(`[${this._id}] - TestGraphInlineComponent.onGraphWhenHide`);
  }
}
