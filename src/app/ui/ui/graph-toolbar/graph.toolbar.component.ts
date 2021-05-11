import {Component, Input} from "@angular/core";
import {Printable} from "../print-component/printers/printable";
import {DxChartPrinter} from "../print-component/printers/dx.chart.printer";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "graph-toolbar",
    styleUrls: ['graph.toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: "graph.toolbar.component.html"
})
export class GraphToolbarComponent {

    @Input()
    titulo: string;

    @Input()
    tituloCentralizado: boolean = false;

    @Input()
    nomeArquivoSalvo: string = "grafico";

    @Input()
    target: any;

    @Input()
    printable: Printable = new DxChartPrinter();

    //'printer', 'png', 'pdf', 'jpeg', 'svg', 'xls'
    @Input()
    excludesPrint: string[] = ['xls'];
}
