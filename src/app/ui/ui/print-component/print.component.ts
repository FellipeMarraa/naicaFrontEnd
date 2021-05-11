import {Component, Input} from "@angular/core";
import {Printable} from "./printers/printable";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "print",
    styleUrls: ['print.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: "print.component.html"
})
export class PrintComponent {

    private _nomeArquivoSalvo: string;

    @Input()
    printable: Printable;

    //'printer', 'png', 'pdf', 'jpeg', 'svg', 'xls'
    @Input()
    excludes: string[] = [];

    private _target: any;

    get target(): any {
        return this._target;
    }

    @Input()
    set target(value: any) {
        this._target = value;
        if (this.printable) {
            this.printable.target = this._target;
        }
    }

    get nomeArquivoSalvo(): string {
        return this._nomeArquivoSalvo;
    }

    @Input()
    set nomeArquivoSalvo(value: string) {
        this._nomeArquivoSalvo = value;
        if (this.printable) {
            this.printable.nomeArquivoSalvo = this._nomeArquivoSalvo;
        }
    }

    imprimir = () => {
        this.printable.imprimir();
    };

    salvarPng = () => {
        setTimeout(() => {
            this.printable.salvarPng()
        });
    };

    salvarPdf = () => {
        setTimeout(() => {
            this.printable.salvarPdf();
        });
    };

    salvarJpeg = () => {
        setTimeout(() => {
            this.printable.salvarJpeg();
        });
    };

    salvarSvg = () => {
        setTimeout(() => {
            this.printable.salvarSvg();
        });
    };

    salvarXls = () => {
        setTimeout(() => {
            this.printable.salvarXls();
        });
    }
}
