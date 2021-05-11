/**
 * A ser implementado por componentes aptos a serem embutidos em um GraphWhenComponent
 * que querem ser notificados do seus estado dentro deste "graph when".
 * 
 * Exemplo:
 * <test-graph-inline-component graphEmbeddable></test-graph-inline-component>
 * 
 * export class TestGraphInlineComponent implements OnInit, GraphEmbeddableAware {}
 */
export abstract class GraphEmbeddableAware {
    abstract onGraphWhenShow();
    abstract onGraphWhenHide();
}
