import {AfterViewInit, Component, EventEmitter, Input, Output} from "@angular/core";
import {ReportProperty} from "../../cadastros-gerais/classes/report.property";
import {ReportViewParameters} from "../../cadastros-gerais/classes/report.view.parameters";
import {MessageType} from "../classes/message.type";
import {Message} from "../classes/message";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {AbstractReport} from "./abstract.report";
import {ReportService} from "../services/report.service";
import {ModeloRelatorioVO} from "../../cadastros-gerais/classes/modelo.relatorio.vo";
import {canShowInNewTab, ReportTypeEnum} from "../../cadastros-gerais/classes/report.type.enum";
import {RelatorioMaillingVO} from "../../cadastros-gerais/classes/relatorio.mailling.vo";

import * as _ from 'lodash';
import {ReportWatcherService} from "../../home/services/report.watcher.service";
import {ToastUiService} from "../services/toast.ui.service";
import {ExceptionInfoService} from "../services/exception.info.service";
import {RelatorioVO} from "../../core/commons/classes/relatorio.vo";
import validationEngine from "devextreme/ui/validation_engine";
import {AbstractReportFilterVO} from "../../core/commons/classes/abstract.report.filter.vo";
import {BehaviorSubject} from "rxjs";

let reportValidationGroupGen: number = 0;

import {ViewEncapsulation} from "@angular/core"
import {AutoSizeService} from "../services/auto.size.service";
import {TabPanelService} from "../services/tab.panel.service";
import {BasePathService} from "../../core/commons/services/base.path.service";
import {mergeMap} from "rxjs/operators";

@Component({
    selector: 'report',
    styleUrls: ['report.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
        <div class="report-container">

            <report-toolbar *ngIf="!embedded"
                            [cssClass]="toolbarCssClass"
                            [rightSectionCssClass]="toolbarRightSectionCssClass"
                            [leftSectionCssClass]="toolbarLeftSectionCssClass"
                            [showLeftSection]="toolbarShowLeftSection"
                            [showRightSection]="toolbarShowRightSection"
                            [title]="toolbarTitle"
                            [titleCssClass]="toolbarTitleCssClass"
                            [allButtonsCssClass]="toolbarAllButtonsCssClass"
                            [runSendButtonCssClass]="toolbarRunSendButtonCssClass"
                            [runButtonCssClass]="toolbarRunButtonCssClass"
                            [clearButtonCssClass]="toolbarClearButtonCssClass"
                            [closeButtonCssClass]="toolbarCloseButtonCssClass"
                            [runSendButtonIconClass]="toolbarRunSendButtonIconClass"
                            [runSendButtonText]="toolbarRunSendButtonText"
                            [runSendButtonOrder]="toolbarRunSendButtonOrder"
                            [runSendButtonShow]="toolbarRunSendButtonShow"
                            [runSendButtonTitle]="toolbarRunSendButtonTitle"
                            [runButtonIconClass]="toolbarRunButtonIconClass"
                            [runButtonText]="toolbarRunButtonText"
                            [runButtonOrder]="toolbarRunButtonOrder"
                            [runButtonShow]="toolbarRunButtonShow"
                            [runButtonTitle]="toolbarRunButtonTitle"
                            [clearButtonIconClass]="toolbarClearButtonIconClass"
                            [clearButtonText]="toolbarClearButtonText"
                            [clearButtonOrder]="toolbarClearButtonOrder"
                            [clearButtonShow]="toolbarClearButtonShow"
                            [clearButtonTitle]="toolbarClearButtonTitle"
                            [closeButtonIconClass]="toolbarCloseButtonIconClass"
                            [closeButtonText]="toolbarCloseButtonText"
                            [closeButtonOrder]="toolbarCloseButtonOrder"
                            [closeButtonShow]="toolbarCloseButtonShow"
                            [closeButtonTitle]="toolbarCloseButtonTitle"
                            (runSendButtonAction)="onToolbarRunSendButtonAction($event)"
                            (runButtonAction)="onToolbarRunButtonAction($event)"
                            (clearButtonAction)="onToolbarClearButtonAction($event)"
                            (closeButtonAction)="onToolbarCloseButtonAction($event)">

                <ng-content select="[report-toolbar-override]"></ng-content>

            </report-toolbar>

            <ng-template #filterFormTemplate>
                <ng-content select="[report-params]"></ng-content>
            </ng-template>

            <div class="report-header">

                <message-panel [(visible)]="messagePanelVisible" [messageType]="messageType"
                               [messages]="messages"></message-panel>

                <div>
                    <ng-content select="[report-header]"></ng-content>
                </div>

                <div class="report-form">

                    <dx-form align="left" [alignItemLabels]="true" [colCount]="2" [formData]="reportViewParameters">

                        <dxi-item *ngIf="!embedded" dataField="reportName"
                                  [label]="{text: 'Relatório', alignment: 'right'}"
                                  template="relatorioTemplate"></dxi-item>
                        <dxi-item *ngIf="!embedded" dataField="enviarNotificacao"
                                  [label]="{text: 'Enviar notificação', alignment: 'right'}"
                                  editorType="dxCheckBox"></dxi-item>
                        <dxi-item dataField="modeloRelatorioVO"
                                  [label]="{text: 'Modelo a utilizar', alignment: 'right'}"
                                  template="modeloTemplate"></dxi-item>
                        <dxi-item dataField="modeloPadraoUsuario"
                                  [label]="{text: 'Padrão do Usuário', alignment: 'right', visible: exibePadraoUsuario}"
                                  template="modeloPadraoUsuarioTemplate"></dxi-item>
                        <dxi-item *ngIf="!embedded" dataField="formato"
                                  [label]="{text: 'Formato a gerar', alignment: 'right'}"
                                  template="formatoTemplate"></dxi-item>
                        <dxi-item *ngIf="!embedded" dataField="exibirRelatorio"
                                  [label]="{text: 'Exibir em nova aba', alignment: 'right', visible: exibeTipoExibicao}"
                                  template="exibirRelatorioTemplate"></dxi-item>
                        <dxi-item dataField="maxResults" *ngIf="limitaResultados"
                                  [label]="{text: 'Limite de Registros', alignment: 'right'}" [colSpan]="2"
                                  editorType="dxNumberBox"
                                  [editorOptions]="{width: 150}"></dxi-item>
                        <dxi-item *ngIf="!embedded" dataField="duracao"
                                  [label]="{text: 'Manter por (dias)', alignment: 'right'}" editorType="dxNumberBox"
                                  [editorOptions]="{width: 80, showSpinButtons: true, min: 0}"></dxi-item>

                        <div *dxTemplate="let data of 'relatorioTemplate'">
                            <dx-select-box [items]="_reports"
                                           [(value)]="selectedReport"
                                           (onValueChanged)="onReportSelected(data, $event)"
                                           displayExpr="title" [width]="500"></dx-select-box>
                        </div>

                        <div *dxTemplate="let data of 'modeloTemplate'">
                            <dx-select-box [items]="modelos"
                                           [(value)]="data.component.option('formData')[data.dataField]"
                                           (onValueChanged)="onModeloSelected($event)"
                                           displayExpr="descricao" [width]="500"></dx-select-box>
                        </div>

                        <div *dxTemplate="let data of 'modeloPadraoUsuarioTemplate'">
                            <dx-check-box *ngIf="exibePadraoUsuario" [(value)]="padraoUsuario"
                                          (onValueChanged)="onModeloPadraoUsuarioChanged($event)"></dx-check-box>
                        </div>

                        <div *dxTemplate="let data of 'exibirRelatorioTemplate'">
                            <dx-check-box *ngIf="exibeTipoExibicao" [(value)]="abrirEmNovaAba"></dx-check-box>
                        </div>

                        <div *dxTemplate="let data of 'formatoTemplate'">
                            <select-box-enum-based [type]="reportTypeEnum"
                                                   [selectedItem]="data.component.option('formData')[data.dataField]"
                                                   (selectedItemChange)="onFormatoSelecionado(data, $event)"
                                                   [width]="250"
                                                   [showClearButton]="false">
                            </select-box-enum-based>
                        </div>

                    </dx-form>

                </div>

                <!-- list filters -->
                <ng-container *ngIf="!collapsibleFilters">
                    <ng-container *ngTemplateOutlet="filterFormTemplate"></ng-container>
                </ng-container>

            </div>

            <div class="report-content">

                <!-- list filters -->
                <div *ngIf="collapsibleFilters" style="flex-shrink: 0;">
                    <dx-accordion #accordion
                                  style="padding-bottom: 4px;"
                                  [(dataSource)]="filterAccordion"
                                  [collapsible]="true"
                                  [animationDuration]="300"
                                  [(selectedItem)]="collapsibleState"
                                  (selectedItemChange)="selectedItemChange($event)">

                        <div *dxTemplate="let title of 'title'">
                            {{ accordionFilterTitle }}
                        </div>

                        <div *dxTemplate="let item of 'item'">
                            <ng-container *ngTemplateOutlet="filterFormTemplate"></ng-container>
                        </div>

                    </dx-accordion>
                </div>

                <ng-content></ng-content>

            </div>

            <dx-popup [(visible)]="emailPopupVisible"
                      [width]="600" [height]="500"
                      [showTitle]="true" title="Enviar Relatório"
                      [dragEnabled]="false" [closeOnOutsideClick]="false">
                <div *dxTemplate="let data of 'content'">

                    <custom-data-grid #emailsGrid gridTitle="Destinatários" validationGroup="emailValidationGroup"
                                      [onRowInserted]="onEmailsAtualizados"
                                      [onRowUpdated]="onEmailsAtualizados"
                                      [onRowRemoved]="onEmailsAtualizados">
                        <dx-data-grid [dataSource]="emails" [cacheEnabled]="false" [height]="330">

                            <dxo-editing
                                    [mode]="'form'"
                                    [texts]="{saveRowChanges: 'Aplicar'}"
                                    [allowUpdating]="true"
                                    [allowDeleting]="true">
                                <dxo-form
                                        align="right"
                                        [alignItemLabels]="true"
                                        [colCount]="1">

                                    <dxi-item dataField="email" [label]="{text: 'E-mail'}"></dxi-item>

                                </dxo-form>
                            </dxo-editing>

                            <dxi-column datatype="string" dataField="email" caption="E-mail"
                                        editCellTemplate="emailTemplate"></dxi-column>

                            <div *dxTemplate="let data of 'emailTemplate'">
                                <ng-container *ngIf="data.isOnForm">
                                    <dx-text-box [value]="emailsGrid.getProperty(data)"
                                                 (valueChange)="emailsGrid.bindProperty(data, $event)"></dx-text-box>
                                </ng-container>
                            </div>
                        </dx-data-grid>
                    </custom-data-grid>

                    <div class="emails-popup-buttons">
                        <dx-button text="Aceitar" (onClick)="onEmailsSelecionados($event)"></dx-button>
                        <dx-button text="Cancelar" type="default" (onClick)="onEnvioCancelado($event)"></dx-button>
                    </div>

                </div>
            </dx-popup>
        </div>
    `,
    providers: [AutoSizeService, TabPanelService]
})
export class ReportComponent<T extends AbstractReportFilterVO> implements AfterViewInit {
    get reports(): ReportProperty[] {
        return this._reports;
    }

    set reports(value: ReportProperty[]) {
        this._reports = value;
        this.reportsChange.next(value);
    }


    get selectedReport(): ReportProperty {
        return this._selectedReport;
    }

    set selectedReport(value: ReportProperty) {
        this._selectedReport = value;
        this.relatorioChange.emit(value);
    }

    @Input() private _reports: ReportProperty[] = [];

    @Input()
    limitaResultados: boolean = false;

    @Input() collapsibleFilters = false;
    filterAccordion = ['filter'];
    accordionFilterTitle = "Ocultar Filtros";
    collapsibleState = this.filterAccordion[0];

    reportViewParameters = new ReportViewParameters();

    modelos: ModeloRelatorioVO[] = [];

    reportTypeEnum = ReportTypeEnum;

    private _selectedReport: ReportProperty;

    padraoUsuario: boolean = false;

    exibePadraoUsuario: boolean = false;

    exibeTipoExibicao: boolean = false;

    //Padrão true
    abrirEmNovaAba: boolean = true;

    emailPopupVisible: boolean = false;

    emails: any[] = [];


    /**
     * Evento de emissão quando o selectbox de relatórios for alterado
     */
    @Output() relatorioChange: EventEmitter<ReportProperty> = new EventEmitter();

    @Output() reportsChange: BehaviorSubject<ReportProperty[]> = new BehaviorSubject(this.reports);

    /**
     * toolbar
     */
    @Input() toolbarCssClass: string = "crud-toolbar";

    @Input() toolbarRightSectionCssClass: string = "crud-toolbar-right-section";

    @Input() toolbarLeftSectionCssClass: string;

    @Input() toolbarShowLeftSection: boolean = true;

    @Input() toolbarShowRightSection: boolean = true;

    @Input() toolbarTitle;

    @Input() toolbarTitleCssClass;

    @Input() toolbarAllButtonsCssClass = "crud-toolbar-buttons";

    /**
     *  toolbar right section buttons
     */
    @Input() toolbarRunSendButtonCssClass;

    @Input() toolbarRunButtonCssClass;

    @Input() toolbarClearButtonCssClass;

    @Input() toolbarDeleteButtonCssClass;

    @Input() toolbarNewButtonCssClass;

    @Input() toolbarCloseButtonCssClass;

    /**
     *  toolbar run button
     */
    @Input() toolbarRunButtonIconClass = "fa fa-cog";
    @Input() toolbarRunButtonText = "Gerar";
    @Input() toolbarRunButtonOrder = 0;
    @Input() toolbarRunButtonShow = true;
    @Input() toolbarRunButtonTitle = "Gerar";

    /**
     *  toolbar run/send button
     */
    @Input() toolbarRunSendButtonIconClass = "fa fa-cog";
    @Input() toolbarRunSendButtonText = "Gerar/Enviar";
    @Input() toolbarRunSendButtonOrder = 1;
    @Input() toolbarRunSendButtonShow = true;
    @Input() toolbarRunSendButtonTitle = "Gerar/Enviar";

    /**
     *  toolbar cancel button
     */
    @Input() toolbarClearButtonIconClass = "fa fa-eraser";
    @Input() toolbarClearButtonText = "Limpar";
    @Input() toolbarClearButtonOrder = 2;
    @Input() toolbarClearButtonShow = true;
    @Input() toolbarClearButtonTitle = "Limpar";

    /**
     *  toolbar close button
     */
    @Input() toolbarCloseButtonIconClass = "fa fa-times-circle";
    @Input() toolbarCloseButtonText = "Fechar";
    @Input() toolbarCloseButtonOrder = 5;
    @Input() toolbarCloseButtonShow = true;
    @Input() toolbarCloseButtonTitle = "Fechar";

    messagePanelVisible: boolean = false;

    messages: string | string[] | Message | Message[];

    messageType: MessageType = "ERROR";

    get embedded(): boolean {
        return this.parent && this.parent.embedded;
    }

    private parent: AbstractReport<T>;

    private idTimer: any = null;

    private loading: boolean = false;

    private filterErrorMap = new Map<string, string>();

    private _validationGroupId: string;

    get validationGroupId(): string {
        return this._validationGroupId;
    }

    constructor(private reportService: ReportService,
                private reportWatcherService: ReportWatcherService,
                private toastService: ToastUiService,
                private exceptionInfoService: ExceptionInfoService,
                private autoSizeService: AutoSizeService,
                private basePathService: BasePathService) {
        this.showException = this.showException.bind(this);
        this.onReportSelected = this.onReportSelected.bind(this);
        this.onModeloSelected = this.onModeloSelected.bind(this);
        this.onModeloPadraoUsuarioChanged = this.onModeloPadraoUsuarioChanged.bind(this);
        this.onEmailsAtualizados = this.onEmailsAtualizados.bind(this);

        this.reportViewParameters.formato = ReportTypeEnum.PDF;

        this._validationGroupId = `reportValidationGroup${reportValidationGroupGen}`;
        reportValidationGroupGen = reportValidationGroupGen + 1;
    }

    setParent(parent: AbstractReport<T>) {
        this.parent = parent;

        this.reportService.getReports(parent).subscribe(reports => {
            this.reports = reports.filter(item => item.visible);
            if (reports && reports.length > 0) {
                if (!this.selectedReport) {
                    this.selectedReport = reports[0];
                }
                this.reportViewParameters.reportName = reports[0].name;
                this.getModelos(reports[0]);
            } else {
                console.error(`ReportComponent: Nenhum relatório registrado para ${this.parent.constructor.name}! (https://bit.ly/2IsB4vo)`)
            }
        }, this.showException)
    }

    showLoading(): void {
        if (this.idTimer) {
            clearTimeout(this.idTimer);
            this.idTimer = null;
        }
        this.messageType = "WARNING";
        this.messages = "Aguarde, gerando relatório...";
        this.messagePanelVisible = true;

        this.loading = true;
    }

    hideLoading(): void {
        if (this.idTimer) {
            clearTimeout(this.idTimer);
            this.idTimer = null;
        }
        this.messagePanelVisible = false;

        this.loading = false;
    }

    showSuccess(nomeRelatorio: string): void {
        this.loading = false;
        if (this.idTimer) {
            clearTimeout(this.idTimer);
            this.idTimer = null;
        }
        this.messageType = "SUCCESS";
        this.messages = `Relatório '${nomeRelatorio}' gerado com sucesso`;
        this.messagePanelVisible = true;

        this.idTimer = setTimeout(() => {
            this.messagePanelVisible = false;
        }, 5000);
    }

    showError(error: string): void {
        this.loading = false;
        if (this.idTimer) {
            clearTimeout(this.idTimer);
            this.idTimer = null;
        }
        this.messageType = "ERROR";
        this.messages = error;
        this.messagePanelVisible = true;
    }

    showException(exception: ExceptionInfo): void {
        this.loading = false;
        if (this.idTimer) {
            clearTimeout(this.idTimer);
            this.idTimer = null;
        }
        this.messageType = "ERROR";
        this.messages = this.exceptionInfoService.toMessages(exception);
        this.messagePanelVisible = true;

        this.validateFilterForm();
    }

    closeMessage(): void {
        this.messagePanelVisible = false;
    }

    onToolbarRunSendButtonAction(event?: any) {

        if (this.loading) {
            return;
        }

        this.clearValidation();

        if (this.validateFilterForm()) {
            this.emailPopupVisible = true;
        } else {
            this.showError("Foram encontrados erros na validação do formulário.");
        }

    }

    onToolbarRunButtonAction(event?: any) {

        if (this.loading) {
            return;
        }

        this.clearValidation();

        if (this.validateFilterForm()) {
            this.emails = [];
            this.reportViewParameters.relatorioMailingVO = new RelatorioMaillingVO();
            this.parent.execFilter();
        } else {
            this.showError("Foram encontrados erros na validação do formulário.");
        }

    }

    onToolbarClearButtonAction(event?: any) {

        if (this.loading) {
            return;
        }

        this.reportViewParameters = new ReportViewParameters();
        this.reportViewParameters.formato = ReportTypeEnum.PDF;
        if (this._reports && this._reports.length > 0) {
            this.reportViewParameters.reportName = this._reports[0].name;
        }
        this.parent.doClear();
        this._selectedReport = this._reports[0];
        this.getModelos(this._selectedReport);
    }

    onToolbarCloseButtonAction(event?: any) {

        this.parent.doClose();

    }

    onReportSelected(data, event: any) {

        data.component.option('formData')[data.dataField] = event.value ? event.value.name : null;
        this.getModelos(event.value);

    }

    getModelos(report: ReportProperty) {
        this.basePathService.getBasePath(this.parent).pipe(
            mergeMap(url => this.reportService.getModelos(report.name, url))
        ).subscribe(modelosVO => {

            let modelos = modelosVO.modeloRelatorioVOList;

            if (!modelos) {
                modelos = [];
            }

            let modeloUnico: ModeloRelatorioVO = null;
            let modeloPadraoUsuario: ModeloRelatorioVO = null;
            let modeloPadrao: ModeloRelatorioVO = null;

            for (let modelo of modelos) {

                if (modelo.unico) {
                    modeloUnico = modelo;
                    break;
                }

                if (modelo.padraoUsuario) {
                    modeloPadraoUsuario = modelo;
                    break;
                }

                if (modelo.padrao) {
                    modeloPadrao = modelo;
                    break;
                }

            }

            if (modelosVO.exibePadrao && !modeloUnico) {
                let padrao = new ModeloRelatorioVO();
                padrao.descricao = "[padrão do sistema]";
                modelos.unshift(padrao);
            }

            this.modelos = modelos;
            this.exibePadraoUsuario = !_.isNil(modeloPadrao) || !_.isNil(modeloPadraoUsuario);
            this.padraoUsuario = !_.isNil(modeloPadraoUsuario);


            this.reportViewParameters.modeloRelatorioVO = modeloUnico || modeloPadraoUsuario || modeloPadrao || this.modelos[0];
        });
    }

    onModeloSelected(event: any) {

        let modelo: ModeloRelatorioVO = event.value;

        if (this.modelos.length == 0 || (this.modelos.length == 1 && !this.modelos[0].id)) {
            return;
        }

        setTimeout(() => {
            this.exibePadraoUsuario = !modelo.id || modelo.padrao;
            this.padraoUsuario = !_.isNil(modelo.padraoUsuario) && modelo.padraoUsuario;
        });

    }

    onFormatoSelecionado(data: any, value: ReportTypeEnum) {

        data.component.option('formData')[data.dataField] = value;

        setTimeout(() => {
            this.exibeTipoExibicao = canShowInNewTab(value);
        });

    }

    onModeloPadraoUsuarioChanged(event: any) {

        let reportName = this.reportViewParameters.reportName;
        let modelo = this.reportViewParameters.modeloRelatorioVO;

        if (!reportName || reportName == '' || !modelo || !modelo.id) {
            return;
        }

        this.reportService.salvaModeloPadrao(reportName, modelo.id, event.value)
            .subscribe(resp => {

                if (resp) {
                    this.toastService.showSuccess("Modelo padrão salvo.");
                } else {
                    this.toastService.showSuccess("Modelo padrão removido.")
                }

                this.modelos.forEach(m => {

                    m.padraoUsuario = m.id == modelo.id;

                });

            }, this.showException);

    }

    onEmailsAtualizados(event: any) {

        this.reportViewParameters.relatorioMailingVO.listaEmails = [];

        for (let emailObj of this.emails) {

            this.reportViewParameters.relatorioMailingVO.listaEmails.push(emailObj.email);

        }

    }

    onEmailsSelecionados(event: any) {

        this.emailPopupVisible = false;
        this.reportViewParameters.enviarEmail = true;
        this.parent.execFilter();

    }

    onEnvioCancelado(event: any) {

        this.emailPopupVisible = false;
        this.emails = [];
        this.reportViewParameters.relatorioMailingVO = new RelatorioMaillingVO();

    }

    exibeRelatorio(relatorioVO: RelatorioVO, abrirEmNovaAba?: boolean) {

        this.reportWatcherService.addReportToQueue(relatorioVO, {
            viewMode: this.parent.abrirEmNovaAba || abrirEmNovaAba ? "OPEN_NEW_WINDOW" : "DOWNLOAD",
            isActive: () => this.parent.active,
            successHandler: filename => {
                if (!this.parent.active) {
                    return false;
                }
                this.parent.showSuccess(filename);
                return true;
            },
            exceptionHandler: error => {
                if (!this.parent.active) {
                    return false;
                }
                this.parent.showException(error);
                return true;
            }
        });

    }

    getFilterError(attribute: string): string {
        return this.filterErrorMap.get(attribute);
    }

    clearValidation(): void {
        this.closeMessage();
        this.filterErrorMap = new Map<string, string>();
    }

    validateFilterForm(): boolean {

        let customFieldsValidation = null;

        try {
            customFieldsValidation = validationEngine.validateGroup(this.validationGroupId);
        } catch (e) {
            console.log("ValidationGroup nao criado: " + this.validationGroupId);
        }

        return (!customFieldsValidation || customFieldsValidation.isValid);

    }

    selectedItemChange(value) {
        setTimeout(() => this.autoSizeService.resize(), 300);
        if (_.isNil(value)) {
            this.accordionFilterTitle = "Exibir Filtros";
        } else {
            this.accordionFilterTitle = "Ocultar Filtros";
        }
    }

    ngAfterViewInit(): void {
        this.autoSizeService.resize();
    }

    ocultarFiltros() {
        this.collapsibleState = undefined;
    }

    exibirFiltros() {
        this.collapsibleState = this.filterAccordion[0];
    }
}