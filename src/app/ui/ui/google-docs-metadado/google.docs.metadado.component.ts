import {Component, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {GoogleDocsComponent} from "../google-docs/google.docs.component";
import {Observable} from "rxjs";
import {AppStateService} from "../../app/services/app.state.service";
import {MetaDadoService} from "../../documento/services/meta.dado.service";
import {Variavel} from "../../documento/classes/variavel";
import {WindowRefService} from "../../app/services/window-ref.service";
import {DxTextAreaComponent} from "devextreme-angular";
import {DomHandler} from "../../app/services/dom.handler";
import {GraphNode} from "../../documento/classes/graph.node";
import {Metodo} from "../../documento/classes/metodo";
import * as _ from 'lodash';

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'google-docs-metadado',
    styleUrls: ["./google.docs.metadado.component.scss"],
    encapsulation: ViewEncapsulation.None,

    template: `
        <div>
            <dx-text-area #detailsText 
                          [height]="20"
                          [width]="250"
                          [readOnly]="true"
                          [(value)]="details"></dx-text-area>
        </div>
        <div class="details-copy-message" *ngIf="copyMessageVisible"><span>Texto copiado! Use ctrl+v para colá-lo ao documento.</span>
        </div>
        <div style="flex-direction: row; display:flex; height: 100%;">
            <div style="flex: 1;">
                <dx-tree-list
                        id="dataSource"
                        keyExpr="id"
                        parentIdExpr="idParent"
                        [height]="'100%'"
                        [dataSource]="dataSource"
                        [allowColumnResizing]="true"
                        [showBorders]="true"
                        [expandedRowKeys]="[1, 2, 10]">

                    <dxo-editing mode="cell" [allowUpdating]="true"></dxo-editing>

                    <dxi-column dataField="nome" [allowEditing]="false" caption="Parâmetros de Contexto"
                                [cellTemplate]="'nomeTemplate'"></dxi-column>
                    <dxi-column dataField="copy" [allowEditing]="false" caption="" [width]="30"
                                [cellTemplate]="'copyTemplate'"></dxi-column>


                    <div *dxTemplate="let data of 'nomeTemplate'">
                        <img style="vertical-align: middle" border="0" src="/GRP/assets/images/{{data.data.getIcon()}}"
                             [width]="15" [height]="15"/>  {{data.value}}
                    </div>

                    <div *dxTemplate="let data of 'copyTemplate'">
                        <img border="0" src="/GRP/assets/images/icons/copy.png" (click)="copyToClipboard(data)"/>
                    </div>

                </dx-tree-list>
            </div>
            <div style="flex: 5;">
                <google-docs #googleDocs [idArquivoDigital]="idArquivoDigital"></google-docs>
            </div>
        </div>
    `
})
export class GoogleDocsMetadadoComponent extends BaseComponent {

    @ViewChild("googleDocs") googleDocs: GoogleDocsComponent;
    @ViewChild("detailsText") detailsText: DxTextAreaComponent;

    constructor(private inject: Injector,
                private appStateService: AppStateService,
                private metaDadoService: MetaDadoService,
                private windowRef: WindowRefService,
                private domHandler: DomHandler) {
        super(inject);
    }

    copyMessageVisible: boolean = false;
    dataSource: GraphNode[];
    copyTimer;
    details: string;

    @Input()
    idArquivoDigital: number;

    doAfterViewInit() {
        this.appStateService.currentSystem.subscribe(currentSystem => {
            this.metaDadoService.getMetaDadoPorContexto(currentSystem.mnemonico).subscribe(result => {
                this.dataSource = this.getResultTreedGridDataSourcer(result);
            });
        });
    }

    private getResultTreedGridDataSourcer(result: GraphNode[]) {
        let newDataSource: GraphNode[] = []
        result.forEach(item => {
            newDataSource.push(item);
            if (item.transicoes) {
                item.transicoes.forEach(itemTransicao => {
                    if (itemTransicao instanceof Variavel) {
                        newDataSource.push(itemTransicao);
                    }
                });
            }
        })
        return newDataSource;
    }

    loadGoogleDocs() {
        setTimeout(() => {
            this.googleDocs.loadEditor();
        }, 1000);
    }

    clearContent() {
        this.googleDocs.clearContent();
    }

    commitFile(): Observable<number> {
        return this.googleDocs.commitFile();
    }

    copyToClipboard(event: any) {
        const nativeWin = this.windowRef.nativeWindow();

        this.details = "${" + this.getTextToClipboard(event) + "}";

        setTimeout(() => {
            const elem = this.detailsText.instance.element();

            this.domHandler.jQuery(elem).find('textarea')[0].select();

            nativeWin.document.execCommand("Copy");

            if (this.copyTimer) {
                nativeWin.clearTimeout(this.copyTimer);
            }

            this.copyMessageVisible = true;

            this.copyTimer = nativeWin.setTimeout(() => {
                this.copyMessageVisible = false;
                this.details = '';
            }, 5000);
        });

    }

    lerGraphTreeNode(graphTreeNode: GraphNode, nodes: string[], isFilhoMetodo: boolean) {
        let nome: string = graphTreeNode.nome;
        if (graphTreeNode.isArray && !isFilhoMetodo) {
            nome = nome + "[0]";
        }
        nodes.push(nome);
        if (!graphTreeNode.isHidePath && graphTreeNode.idParent != null) {
            let parent: GraphNode = this.dataSource.find(item => item.id == graphTreeNode.idParent);
            this.lerGraphTreeNode(parent, nodes, graphTreeNode instanceof Metodo);
        }
    }

    getNodeNames(graphTreeNode: GraphNode): string[] {
        let nodeReverse: string[] = [];
        this.lerGraphTreeNode(graphTreeNode, nodeReverse, false);
        let nodes: string[] = [];
        for (let i = nodeReverse.length - 1, j = 0; i >= 0; i--, j++) {
            nodes[j] = nodeReverse[i];
        }
        return nodes;
    }

    private getTextToClipboard(event: any): string {
        let node: GraphNode = event.data;
        let parent: GraphNode = this.dataSource.find(item => item.id == node.idParent);
        if (parent != null && parent instanceof Metodo && !node.isEnum && !node.isParam) {
            return;
        }
        let nodes: string[] = this.getNodeNames(node);
        let ehFuncao: boolean = node instanceof Metodo;
        let text: string = "";
        nodes.forEach(n => {
            if (!_.isEmpty(text)) {
                text += ".";
            }
            text += n;
        });

        if (!ehFuncao) {
            return text;
        } else {
            if (node instanceof Metodo) {
                let metodo: Metodo = node;
                let parametros: Variavel[] = metodo.parametros;
                let textParametros: string = "";
                parametros.forEach(variable => {
                    if (!_.isEmpty(textParametros)) {
                        textParametros += ", ";
                    }
                    let tipo: string = variable.nome.includes("\"") ? "" : "_" + variable.tipo;
                    textParametros += variable.nome + tipo;
                });

                return text + "(" + textParametros + ")";
            }
        }
    }
}