import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {Subscription} from "rxjs";
import {AppStateService} from "../../app/services/app.state.service";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "ano-seletor",
    templateUrl: "./ano.seletor.component.html",
    styleUrls: ["./ano.seletor.component.scss"],
    encapsulation: ViewEncapsulation.None,

})
export class AnoSeletorComponent implements OnInit, OnDestroy {
    constructor(private objectUtilsService: ObjectUtilsService) {
    }

    anosVisiveis: number[] = [];

    private _anosSelecionados: number[] = [];

    @Input()
    set anosSelecionados(value: number[]) {
        this._anosSelecionados = value || [];
        //this.emitAnosSelecionados();
    }

    get anosSelecionados() {
        return this._anosSelecionados;
    }

    private _multiplo: boolean = false;

    @Output()
    onAnoSelecionado = new EventEmitter<number[]>();

    @Input()
    quantidadeAnosVisiveis: number;

    @Input()
    exibeSelecionarTodos: boolean = false;

    @Input()
    exibeDeselecionarTodos: boolean = false;

    private _anos: number[] = [];

    clear() {
        this.anosSelecionados = [];
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    getStyle(ano: number) {
        if (!this.objectUtilsService.isEmptyArray(this.anosSelecionados)) {
            return this.anosSelecionados.includes(ano) ? "#e3e3e3" : "white";
        }
        return '';
    }

    @Input()
    set multiplo(value: boolean) {
        this._multiplo = value;

        // match last element if not multiple
        if (!value && !this.objectUtilsService.isEmptyArray(this.anosSelecionados)) {
            this.anosSelecionados = this.anosSelecionados.slice(this.anosSelecionados.length - 1);
        }
    }

    get multiplo() {
        return this._multiplo;
    }

    @Input()
    set anos(anos: number[]) {
        this._anos = anos;
        if (anos) {
            if (this.quantidadeAnosVisiveis < anos.length) {
                this.anosVisiveis = this.anos.slice(-this.quantidadeAnosVisiveis);
            } else {
                this.anosVisiveis = this.anos;
            }
        }
    }

    get anos(): number[] {
        return this._anos;
    }

    setAnoSelecionado(ano: number) {
        if (ano) {

            /*
             * funcionamento de toggle()
             */
            const index = this.anosSelecionados.indexOf(ano);

            // do not exist -> add
            if (index === -1) {
                if (this.multiplo) {
                    this.anosSelecionados.push(ano);
                } else {
                    this.anosSelecionados = [ano];
                }
            } else {
                // exists -> delete
                if (this.multiplo) {
                    this.anosSelecionados.splice(index, 1);
                } else {
                    this.anosSelecionados = [];
                }
            }
        }

        this.emitAnosSelecionados();
    }

    emitAnosSelecionados() {
        const arr = [];
        if (this.anosSelecionados) {
            this.objectUtilsService.addAll(arr, this.anosSelecionados);
        }
        this.onAnoSelecionado.emit(arr);
    }

    scrollLeft() {
        let index = this.anos.indexOf(this.anosVisiveis[0]);
        if (index > 0) {
            index--;
            this.anosVisiveis = this.anos.slice(index, index + this.quantidadeAnosVisiveis);
        }
    }

    scrollRight() {
        let index = this.anos.indexOf(this.anosVisiveis[0]);
        if (index + this.quantidadeAnosVisiveis < this.anos.length) {
            index++;
            this.anosVisiveis = this.anos.slice(index, index + this.quantidadeAnosVisiveis);
        }
    }

    selecionarTodos() {
        const selecionados = new Set(this.anosSelecionados);
        if (this.anos) {
            this.anos
                .filter(ano => !selecionados.has(ano))
                .forEach(ano => this.setAnoSelecionado(ano));
        }
    }

    deselecionarTodos() {
        const selecionados = [];
        this.objectUtilsService.addAll(selecionados, this.anosSelecionados);
        selecionados.forEach(ano => this.setAnoSelecionado(ano));
    }
}
