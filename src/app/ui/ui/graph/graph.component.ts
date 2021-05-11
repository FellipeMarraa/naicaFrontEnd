import {
    AfterContentInit,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import {GraphWhenComponent} from "./graph.when.component";
import {GraphDefaultComponent} from "./graph.main.component";

export interface GraphChain {

  drilldown();

  drillup();

}

/**
 * Exemplo simples:
 * <graph>


    <graph-default>
      <h3>gráfico X</h3>
    </graph-default>


    <graph-when depth="1">
      <span>Gráfico do primeiro drilldown</span>
    </graph-when>

    <graph-when depth="2">
      <span>Gráfico do segundo drilldown</span>
    </graph-when>

  </graph>

 * Exemplo de graphs aninhados:
 * <graph>


    <graph-default>
      <h3>gráfico X</h3>
    </graph-default>


    <graph-when depth="1">
      <span>Gráfico do primeiro drilldown</span>
    </graph-when>

    <graph-when depth="2">
      <span>Gráfico do segundo drilldown</span>
    </graph-when>

  </graph>

 * 
 * @export
 * @class GraphComponent
 * @implements {OnInit}
 * @implements {AfterContentInit}
 */
@Component({
  selector: "graph",
  template: `
    <div id="{{id}}" [ngStyle]="{ 'display': displayStyle}" class="graphPrint"><ng-content></ng-content></div>
  `
})
export class GraphComponent implements OnInit, AfterContentInit, GraphChain {
  @ContentChildren(GraphWhenComponent) whens: GraphWhenComponent[];

  @ContentChild(GraphDefaultComponent) main: GraphDefaultComponent;

  @Input() currentDepth = 0;

  @Input() id: string;

  @Input() parentChain: GraphChain;

  @Input() embedded = false;

  private _visible = true;

  displayStyle = '';

  @Input()
  set visible(visible: boolean){
    this._visible = visible;
    this.displayStyle = visible ? 'block' : 'none';
  }

  get visible(){
    return this._visible;
  }

  @Output()
  onGraphDefaultVisibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private drilldownDepth = 0;

  ngOnInit() {}

  ngAfterContentInit(): void {
    this.applyState();
  }

  parentDrillup() {
    if (this.parentChain != null) {
      this.parentChain.drillup();
    }
  }

  parentDrilldown() {
    if (this.parentChain != null) {
      this.parentChain.drilldown();
    }
  }

  private applyState() {
    this.drilldownDepth = this.whens.length;

    this.main.show = this.currentDepth == 0;

    this.onGraphDefaultVisibilityChanged.emit(this.main.show);

    this.whens.forEach((when: GraphWhenComponent) => {
      when.show = this.currentDepth == +when.depth;
    });
  }

  drilldown() {
    this.currentDepth = ++this.currentDepth > this.drilldownDepth ? this.drilldownDepth : this.currentDepth;
    this.applyState();
  }

  drillup() {
    this.currentDepth = --this.currentDepth < 0 ? 0 : this.currentDepth;
    this.applyState();
  }

}
