import {Component, Injector, Input} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {ArquivoDigitalService} from "../services/arquivo.digital.service";

@Component({
    selector: 'pdf-viewer',
    template: `
        <object [data]="url | safe" type="application/pdf" [width]="width" [height]="height"></object>
    `
})
export class PdfViewerComponent extends BaseComponent {

    url;

    private _idArquivoDigital: number;

    get idArquivoDigital(): number {
        return this._idArquivoDigital;
    }

    @Input()
    set idArquivoDigital(idArquivoDigital: number) {
        this._idArquivoDigital = idArquivoDigital;
        if (idArquivoDigital) {
            this.url = `${this.arquivoDigitalService.downloadURL()}?id=${idArquivoDigital}`;
        }
    }

    @Input()
    width: any = '100%';

    @Input()
    height: any = '100%';

    constructor(private injector: Injector,
                private arquivoDigitalService: ArquivoDigitalService) {
        super(injector);
    }

}
