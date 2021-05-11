import {Component, ElementRef, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {Tarefa} from "../../core/commons/classes/tarefa";
import {TarefaService} from "../../core/commons/services/tarefa.service";
import {Observable, timer} from "rxjs";
import {flatMap, takeWhile} from "rxjs/operators";
import {DomHandler} from "../../app/services/dom.handler";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'tarefa-progress-bar',
    styleUrls: ['./tarefa.progress.bar.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `        
        <dx-progress-bar #progressBar
                         id="progress-bar-status"
                         [width]="width"
                         [class.complete]="progressBar.value == maximo"
                         [class.error]="error"
                         [min]="0"
                         [max]="maximo"
                         [statusFormat]="textFormat"
                         [visible]="visible"
                         [value]="percentualConcluido">
        </dx-progress-bar>
        
        <message-details-popup *ngIf="showDetailOnError" [(visible)]="detailsVisible" [details]="currentDetails"></message-details-popup>
    `
})
export class TarefaProgressBarComponent extends BaseComponent {

    maximo: number = 100;

    detailsVisible: boolean = false;

    currentDetails: string;

    @Input()
    showDetailOnError: boolean = false;

    @Input()
    width: string;

    @Input()
    visible: boolean;

    error: boolean = false;

    @Output()
    onFinished: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    @Output()
    onError: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    @Output()
    onUpdated: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    tarefa: Tarefa;

    percentualConcluido: number;

    private _idTarefa: number;

    private detailErrorElement;

    constructor(private tarefaService: TarefaService,
                private injector: Injector,
                private domHandler: DomHandler,
                private element: ElementRef) {
        super(injector);
        this.textFormat = this.textFormat.bind(this);

        this.detailErrorElement = domHandler.jQuery("<a style='margin-left: 10px;' href='javascript:void(0)'>Ver detalhes</a>")
        this.detailErrorElement.on('click', () => {
            this.detailsVisible = true;
        });
    }

    ngOnDestroy(): void {
        this.detailErrorElement.off('click');
    }

    get idTarefa(): number {
        return this._idTarefa;
    }

    @Input()
    set idTarefa(idTarefa: number) {
        this._idTarefa = idTarefa;
        if (idTarefa) {
            this.consultarTarefa(idTarefa);
        }
    }

    protected doOnInit() {
    }

    textFormat(value) {

        const percent = parseInt((value * 100).toFixed());
        const text = 'Progresso: ' + percent + '%';
        const textComplete = "Tarefa Concluida!";
        const errorText = 'Erro no processamento!';

        return this.error ? errorText : percent < 100 ? text : text + "      -      " + textComplete;
    }

    private consultarTarefa(idTarefa: number) {
        this.consultarTarefaObservable(idTarefa).subscribe(tarefa => {
            this.percentualConcluido = tarefa.percentualConcluido;
            this.setPercentual(tarefa);
            this.onUpdated.emit(tarefa);
        }, error1 => {
            this.handleError(error1);
        }, () => {
            this.finalizaOperaca(idTarefa);
        });
    }

    private consultarTarefaObservable(idTarefa: number): Observable<Tarefa> {
        return timer(0, 1000).pipe(
            flatMap(tarefa => this.tarefaService.consultaTarefa(idTarefa)),
            takeWhile(tarefa => tarefa.finishTime == null && tarefa.stopTime == null)
        )
    }

    private finalizaOperaca(idTarefa: number) {
        this.tarefaService.consultaTarefa(idTarefa).subscribe(tarefa => {
            this.setPercentual(tarefa);

            if(this.isTarefaError(tarefa)) {
                this.onError.emit(tarefa);
            }

            this.onFinished.emit(tarefa);
        });
    }


    private isTarefaError(tarefa: Tarefa) {
        if (tarefa != null && !this._.isNil(tarefa.startTime) && !this._.isNil(tarefa.stopTime) && this._.isNil(tarefa.finishTime)){
            return true;
        }
        return false;
    }

    private setPercentual(tarefa: Tarefa) {
        if(this.isTarefaError(tarefa)) {
            this.error = true;
            this.setErrorDetail(tarefa);
            this.percentualConcluido = 100;
        } else {
            this.error = false;
            this.percentualConcluido = tarefa.percentualConcluido || 0;
        }
    }

    public resetPercentual() {
        this.percentualConcluido = 0;
    }

    private setErrorDetail(tarefa: Tarefa) {
        this.currentDetails = tarefa.log;
        setTimeout( () => {
            this.domHandler.jQueryWithContext(".dx-progressbar-status", this.domHandler.jQuery(this.element.nativeElement)).append(this.detailErrorElement);
        }, )
    }
}