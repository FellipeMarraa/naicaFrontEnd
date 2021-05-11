import {Component, Injector, Input} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {ArquivoDigitalService} from "../services/arquivo.digital.service";
import {WindowRefService} from "../../app/services/window-ref.service";

@Component({
    selector: 'arquivo-digital-download-button',
    styleUrls: ['./arquivo.digital.donwload.button.component.scss'],
    template: `
        <dx-button [disabled]="disabled" [icon]="icon" (onClick)="download($event)"></dx-button>
    `
})
export class ArquivoDigitalDownloadButtonComponent extends BaseComponent {

    @Input()
    icon: string = "fa fa-download fa-lg";

    @Input()
    disabled: boolean = true;

    @Input()
    autoDisabled: boolean = true;

    private _idArquivoDigital: number;

    get idArquivoDigital(): number {
        return this._idArquivoDigital;
    }

    @Input()
    set idArquivoDigital(value: number) {
        this._idArquivoDigital = value;
        this.switchVisibleButton(value);
    }

    constructor(private injector: Injector,
                private windowRefService: WindowRefService,
                private arquivoDigitalService: ArquivoDigitalService) {
        super(injector);
    }

    private switchVisibleButton(idArquivoDigital: number) {
        if(this.autoDisabled) {
            this.disabled = idArquivoDigital ? false : true;
        }
    }

    download(event: MouseEvent) {
        if (!this.disabled) {
            this.donwloadArquivo(this.idArquivoDigital);
        }
    }

    private donwloadArquivo(idArquivoDigital: number) {
        if (this.idArquivoDigital) {
            this.arquivoDigitalService.downloadArquivoDigital(this.idArquivoDigital);
        }
    }
}