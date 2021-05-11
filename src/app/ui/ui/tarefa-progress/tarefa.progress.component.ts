import {Component, ElementRef, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {Tarefa} from "../../core/commons/classes/tarefa";
import {TarefaService} from "../../core/commons/services/tarefa.service";
import {Observable, Subscription} from "rxjs";
import {DomHandler} from "../../app/services/dom.handler";
import {TarefaWebSocketVO} from "../../core/commons/classes/tarefa.websocket.vo";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'tarefa-progress',
    styleUrls: ['./tarefa.progress.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
	    <dx-progress-bar #progressBar
                         [showStatus]="showStatus"
	                     [width]="width"
	                     [class.complete]="progressBar.value == percentualMaximo"
	                     [class.error]="error"
	                     [min]="0"
	                     [max]="percentualMaximo"
	                     [statusFormat]="textFormat"
	                     [visible]="visible"
	                     [value]="percentualConcluido">
	    </dx-progress-bar>
	
	    <message-details-popup [(visible)]="detailsVisible" [details]="currentDetails"></message-details-popup>
    `
})
export class TarefaProgressComponent extends BaseComponent {

    private _idTarefa: number;

    get idTarefa(): number {
        return this._idTarefa;
    }

    @Input()
    set idTarefa(value: number) {
        if (this.idTarefa != value) {
            this._idTarefa = value;
            this.resetPercentual(value);
            this.topicStatusTarefa = this.watchTarefaStatus(value);
        }
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    @Input()
    mostrarPopUpErros: boolean = false;

    @Input()
    showStatus: boolean = false;

    @Input()
    width: string;

    @Input()
    visible: boolean = true;

    @Output()
    onFinished: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    @Output()
    onError: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    @Output()
    onUpdated: EventEmitter<Tarefa> = new EventEmitter<Tarefa>();

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    retornoTarefa: string;

    topicStatusTarefa: Subscription;

    error: boolean = false;

    percentualMaximo: number = 100;

    detailsVisible: boolean = false;

    currentDetails: string;

    percentualConcluido: number = 0;

    detailErrorElement;

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    constructor(private tarefaService: TarefaService,
                private injector: Injector,
                private domHandler: DomHandler,
                private element: ElementRef) {
        super(injector);

        this.textFormat = this.textFormat.bind(this);
        this.listenOnErrorElement();
    }

    protected doOnDestroy() {
        this.unsubscribeTopic();
        this.detailErrorElement.off('click');
    }


    private unsubscribeTopic() {
        if(this.topicStatusTarefa) {
            this.topicStatusTarefa.unsubscribe();
        }
    }

    protected doOnInit() {
        // this.topicStatusTarefa = this.watchTarefaStatus(this.idTarefa);
    }

    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    private listenOnErrorElement() {
        this.detailErrorElement = this.domHandler.jQuery("<a style='margin-left: 10px;' href='javascript:void(0)'>Ver detalhes</a>");
        this.detailErrorElement.on('click', () => {
            this.detailsVisible = true;
        });
    }

    private watchTarefaStatus(idTarefa: number): Subscription {
        if(this.topicStatusTarefa){
            this.topicStatusTarefa.unsubscribe();
        }

        if(idTarefa) {
            let subscription = this.tarefaService.watchTarefaStatus(idTarefa).subscribe(tarefaVO => {
                this.handleNotificaTarefaStatus(tarefaVO);
            });

            this.tarefaService.fireTarefaStatusChange(idTarefa);
            return subscription;
        }
    }

    private handleNotificaTarefaStatus(tarefaVO: TarefaWebSocketVO) {
        if (tarefaVO) {
            this.handleTarefaFacade(tarefaVO.tarefa)
        } else {
            this.retornoTarefa = null;
        }
    }


    //_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

    private handleTarefaFacade(tarefa: Tarefa) {
        this.setPercentualTarefa(tarefa);
        this._handleError(tarefa);
        this.handleFinish(tarefa);
    }

    private _handleError(tarefa: Tarefa) {
        if(this.isErrorTarefa(tarefa)) {
            this.onError.emit(tarefa);
            this.percentualConcluido = 100;
            this.error = true;
            this.setErrorDetail(tarefa);
        } else {
            this.error = false;
        }
    }

    private setErrorDetail(tarefa: Tarefa) {
        this.currentDetails = tarefa.log;
        setTimeout( () => {
            this.domHandler.jQueryWithContext(".dx-progressbar-status", this.domHandler.jQuery(this.element.nativeElement)).append(this.detailErrorElement);
        }, )
    }

    private isErrorTarefa(tarefa: Tarefa) {
        if (tarefa != null && !this._.isNil(tarefa.startTime) && !this._.isNil(tarefa.stopTime) && this._.isNil(tarefa.finishTime)) {
            return true;
        }
        return false;
    }

    private setPercentualTarefa(tarefa: Tarefa) {
        this.percentualConcluido = tarefa ? tarefa.percentualConcluido || 0 : 0;
        this.onUpdated.emit(tarefa);
    }

    private resetPercentual(idTarefa: number) {
        if(idTarefa) {
            this.showStatus = true;
        } else {
            this.showStatus = false;
            this.percentualConcluido = 0;
        }
    }

    private handleFinish(tarefa: Tarefa) {
        if(tarefa.finishTime != null) {
            this.onFinished.emit(tarefa);
        }
    }

    textFormat(value) {
        const percent = parseInt((value * 100).toFixed());
        const text = 'Progresso: ' + percent + '%';
        const textComplete = "Tarefa Concluida!";
        const errorText = 'Erro no processamento!';
        return this.error ? errorText : percent < 100 ? text : text + "      -      " + textComplete;
    }
}
