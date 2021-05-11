import { Directive, forwardRef, Inject, ViewContainerRef, AfterViewInit } from "@angular/core";
import { GraphEmbeddableAware } from "./graph.embeddable.aware";
import { OnInit } from "@angular/core";

/**
 * Use esta diretiva de atributo para declarar um elemento apto a ser
 * embedded em um GraphWhenComponent. Isto permitirá ao componente GraphWhenComponent
 * conhecer o componente embutido podendo notificá-los de diversos estados se este
 * implementar a interface GraphEmbeddableAware.
 *
 * Exemplo:
 * <test-graph-inline-component graphEmbeddable></test-graph-inline-component>
 *
 * export class TestGraphInlineComponent implements GraphEmbeddableAware {}
 *
 */
@Directive({ selector: "[graphEmbeddable]" })
export class GraphEmbeddableDirective implements OnInit, AfterViewInit {
  hostComponent: GraphEmbeddableAware;

  constructor(private vcr: ViewContainerRef) {}

  ngOnInit(): void {
    this.assignHostComponent();
  }

  ngAfterViewInit(): void {
    this.assignHostComponent();
  }
  protected assignHostComponent(): void {
    this.hostComponent = this.vcr["_data"].componentView.component;
  }
}
