import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {MesVO} from "../../core/commons/classes/mes.vo";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {AppStateService} from "../../app/services/app.state.service";
import {Subscription} from "rxjs";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "mes-seletor",
    templateUrl: "./mes.seletor.component.html",
    styleUrls: ['./mes.seletor.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class MesSeletorComponent implements OnInit, OnDestroy {
    static readonly DECIMO_TERCEIRO_MES_LABEL = "D.Ter";
    static readonly DECIMO_QUARTO_MES_LABEL = "D.Quar";

    meses: string[] = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];

    private _mesesSelecionados: number[] = [];

    @Input()
    width: number;

    @Input()
    set mesesSelecionados(value: number[]) {
        this._mesesSelecionados = value || [];
    }

    get mesesSelecionados() {
        return this._mesesSelecionados;
    }

    private _multiplo: boolean = false;

    @Output()
    onMesesSelecionados = new EventEmitter<MesVO[]>();

    private _hasDecimoTerceiro: boolean = false;

    private _hasDecimoQuarto: boolean = false;

    @Input()
    set hasDecimoTerceiro(value: boolean) {
        this._hasDecimoTerceiro = value;
        if (value) {
            this.meses.push(MesSeletorComponent.DECIMO_TERCEIRO_MES_LABEL);
        } else {
            const index = this.meses.indexOf(MesSeletorComponent.DECIMO_TERCEIRO_MES_LABEL);
            if (index != -1) {
                this.meses.splice(index, 1);
            }
        }
    }

    get hasDecimoTerceiro() {
        return this._hasDecimoTerceiro;
    }

    @Input()
    set hasDecimoQuarto(value: boolean) {
        this._hasDecimoQuarto = value;
        if (value) {
            this.meses.push(MesSeletorComponent.DECIMO_QUARTO_MES_LABEL);
        } else {
            const index = this.meses.indexOf(MesSeletorComponent.DECIMO_QUARTO_MES_LABEL);
            if (index != -1) {
                this.meses.splice(index, 1);
            }
        }
    }

    get hasDecimoQuarto() {
        return this._hasDecimoQuarto;
    }

    constructor(private objectUtilsService: ObjectUtilsService) {
    }

    clear() {
        this.mesesSelecionados = [];
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    getStyle(indiceMes: number) {
        if (!this.objectUtilsService.isEmptyArray(this.mesesSelecionados)) {
            return this.mesesSelecionados.includes(indiceMes) ? "#e3e3e3" : "white";
        }
        return '';
    }

    @Input()
    set multiplo(value: boolean) {
        this._multiplo = value;

        // match last element if not multiple
        if (!value && !this.objectUtilsService.isEmptyArray(this.mesesSelecionados)) {
            this.mesesSelecionados = this.mesesSelecionados.slice(this.mesesSelecionados.length - 1);
        }
    }

    get multiplo() {
        return this._multiplo;
    }

    setMesSelecionado(mes: number, indexOf: number) {
        if (mes) {

            /*
             * funcionamento de toggle()
             */
            const index = this.mesesSelecionados.indexOf(indexOf);

            // do not exist -> add
            if (index === -1) {
                if (this.multiplo) {
                    this.mesesSelecionados.push(indexOf);
                } else {
                    this.mesesSelecionados = [indexOf];
                }
            } else {
                // exists -> delete
                if (this.multiplo) {
                    this.mesesSelecionados.splice(index, 1);
                } else {
                    this.mesesSelecionados = [];
                }
            }
        }

        this.emitMesesSelecionados();
    }

    emitMesesSelecionados() {
        const output: MesVO[] = [];

        if (!this.objectUtilsService.isEmptyArray(this.mesesSelecionados)) {
            for (let indiceMes of this.mesesSelecionados) {
                const mesVO: MesVO = new MesVO();
                mesVO.numero = indiceMes + 1;
                mesVO.zeroBaseIndice = indiceMes;
                mesVO.nome = this.meses[indiceMes];
                output.push(mesVO);
            }
        }

        this.onMesesSelecionados.emit(output);
    }
}
