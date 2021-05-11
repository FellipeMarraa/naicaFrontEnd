import {Component, Injector, Input} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {Tarefa} from "../../core/commons/classes/tarefa";
import {TarefaService} from "../../core/commons/services/tarefa.service";
import {JobStatus} from "../../core/commons/classes/job.status";
import {Observable, Subscription} from "rxjs";
import {TarefaWebSocketVO} from "../../core/commons/classes/tarefa.websocket.vo";


export type ColorStatusTarefaType = { color: string, nome: string,tooltipText: string };

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'tarefa-status-indicator',
    styleUrls: ['./tarefa.status.indicator.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
		<tooltip-helper
				[clickMode]="clickMode"
				[disabledTooltip]="tooltipDisabled"
				[backgroudColor]="colorStatus.color"
				[text]="retornoTarefa ? retornoTarefa : colorStatus.tooltipText"
				[iconText]="faClassIcon ? null : ' '"
				[icon]="faClassIcon">
		</tooltip-helper>
    `
})
export class TarefaStatusIndicatorComponent extends BaseComponent {


    static readonly ColorStatusTarefa = (() => {
        const ColorStatus = {
            ['UNDEFINED']: <ColorStatusTarefaType>{color: '#b4b4b4', nome: "Indefinido", tooltipText: 'Sem informação no momento'},
            [JobStatus.QUEUE]: <ColorStatusTarefaType>{color: '#5e87b0', nome: "Pendente", tooltipText: 'Tarefa pendente'},
            [JobStatus.RUNNING]: <ColorStatusTarefaType>{color: '#dad600', nome: "Executando", tooltipText: 'Tarefa em execução'},
            [JobStatus.FINISHED]: <ColorStatusTarefaType>{color: '#00ae20', nome: "Finalizado", tooltipText: 'Tarefa finalizada'},
            [JobStatus.STOPPED]: <ColorStatusTarefaType>{color: '#e63d2f', nome: "Cancelado", tooltipText: 'Tarefa cancelada'},
            [JobStatus.NOTFOUND]: <ColorStatusTarefaType>{color: '#484848', nome: "Não Encontrada", tooltipText: 'Tarefa não encontrada'}
        };
        return ColorStatus;
    })();

    colorStatus: ColorStatusTarefaType = TarefaStatusIndicatorComponent.ColorStatusTarefa.UNDEFINED;

    private _idTarefa: number;

    get idTarefa(): number {
        return this._idTarefa;
    }

    @Input()
    set idTarefa(value: number) {
        if (this.idTarefa != value) {
            this._idTarefa = value;
            this.topicStatusTarefa = this.watchTarefaStatus(value);
            if(!this.topicStatusTarefa) {
                this.handleNotificaTarefaStatus(null);
            }
        }
    }

    @Input()
    clickMode: boolean = false;

    @Input()
    tooltipDisabled: boolean = true;

    @Input()
    faClassIcon: string;

    retornoTarefa: string;

    constructor(private tarefaService: TarefaService,
                private injector: Injector) {
        super(injector);
    }

    protected doOnDestroy() {
        this.unsubscribeTopic();
    }

    private unsubscribeTopic() {
        if(this.topicStatusTarefa) {
            this.topicStatusTarefa.unsubscribe();
        }
    }

    private topicStatusTarefa: Subscription;

    private watchTarefaStatus(idTarefa: number): Subscription {
        this.unsubscribeTopic();

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
            this.colorStatus = this.getColorStatus(tarefaVO.tarefa);
            this.retornoTarefa = tarefaVO.tarefa.retorno;
        } else {
            this.colorStatus = this.getColorStatus(null);
            this.retornoTarefa = null;
        }
    }

    private getColorStatus(tarefa: Tarefa): ColorStatusTarefaType {
        let classColor;

        if (tarefa) {
            classColor = TarefaStatusIndicatorComponent.ColorStatusTarefa[tarefa.getStatus()];
        }

        return classColor ? classColor : TarefaStatusIndicatorComponent.ColorStatusTarefa.UNDEFINED;
    }
}
