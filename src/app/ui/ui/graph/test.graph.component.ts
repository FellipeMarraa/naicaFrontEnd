import { Component, OnInit, Output, Input, ComponentFactoryResolver, AfterContentInit } from "@angular/core";
import { ViewChildren, ContentChildren, ViewChild } from "@angular/core";
import { GraphComponent } from "./graph.component";

@Component({
  selector: "test-graph",
  template: `
  <graph #testGraph>

  <graph-default>
      <h3>gráfico X</h3>
    </graph-default>


    <graph-when depth="1">
      <test-graph-inline-component graphEmbeddable id="1º - primeiro drilldown"></test-graph-inline-component>
    </graph-when>

    <graph-when depth="2">
      <test-graph-inline-component graphEmbeddable id="2º - segundo drilldown"></test-graph-inline-component>
    </graph-when>

  </graph>

  <button style="width: 100px" (click)="drillup()">drillup</button>
  <button style="width: 100px" (click)="drilldown()">drilldown</button>

  `
})
export class TestGraphComponent implements OnInit, AfterContentInit {
  @ViewChild("testGraph", { static: true }) private testGraph: GraphComponent;

  ngAfterContentInit(): void {
    console.log("TestGraphComponent.ngAfterContentInit");
  }
  ngOnInit(): void {
    console.log("TestGraphComponent.ngOnInit");
  }

  drilldown() {
    this.testGraph.drilldown();
  }

  drillup() {
    this.testGraph.drillup();
  }
}
