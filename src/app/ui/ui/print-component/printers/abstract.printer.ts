import {Printable} from "./printable";
import { Input, Directive } from "@angular/core";

@Directive()
export abstract class AbstractPrinter<T> implements Printable {

    @Input()
    nomeArquivoSalvo: string;
    @Input()
    target: T;

    imprimir() {
        const comp: any = this.target;
        comp.instance.print();
    };

    salvarPng() {
        const comp: any = this.target;
        comp.instance.exportTo(this.nomeArquivoSalvo, "PNG");
    };

    salvarPdf() {
        const comp: any = this.target;
        comp.instance.exportTo(this.nomeArquivoSalvo, "PDF");
    };

    salvarJpeg() {
        const comp: any = this.target;
        comp.instance.exportTo(this.nomeArquivoSalvo, "JPEG");
    };

    salvarSvg() {
        const comp: any = this.target;
        comp.instance.exportTo(this.nomeArquivoSalvo, "SVG");
    };

    salvarXls() {
        const comp: any = this.target;
        comp.export.fileName = this.nomeArquivoSalvo;
        comp.instance.exportToExcel(false);
    };
}
