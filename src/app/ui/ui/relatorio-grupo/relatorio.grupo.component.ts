import {
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Injector,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {RelatorioGrupo} from "../../core/commons/classes/relatorio.grupo";
import {jacksonMetadata, JacksonService} from "@sonner/jackson-service-v2";
import {RelatorioGrupoItem} from "../../core/commons/classes/relatorio.grupo.item";
import {DxDropDownBoxComponent, DxListComponent, DxTreeViewComponent} from "devextreme-angular";
import {RelatorioGrupoService} from "../../core/commons/services/relatorio.grupo.service";
import {BaseComponent} from "../base-component/base.component";
import {getReportType} from "../../../../report.module";
import {RelatorioGrupoItemTipoEnum} from "../../core/commons/classes/relatorio.grupo.item.tipo.enum";
import {RelatorioGrupoItemService} from "../../core/commons/services/relatorio.grupo.item.service";
import {RelatorioHostDirective} from "./relatorio.host.directive";
import {AbstractReport} from "../report/abstract.report";
import {RelatorioGrupoTipoArquivoEnum} from "../../core/commons/classes/relatorio.grupo.tipo.arquivo.enum";
import {GoogleDocsComponent} from "../google-docs/google.docs.component";
import {GoogleDriveFileTypeEnum} from "../../cadastros-gerais/classes/google.drive.file.type.enum";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import {ReportWatcherService} from "../../home/services/report.watcher.service";
import {Observable, of, throwError} from "rxjs";
import {filter, map, switchMap} from "rxjs/operators";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {AbstractReportFilterVO} from "../../core/commons/classes/abstract.report.filter.vo";
import {ArquivoDigitalComponent} from "../arquivo-digital/arquivo.digital.component";
import {ReportAngularMenuVO} from "../../core/commons/classes/report.angular.menu.vo";
import * as _ from "lodash";
import {AdjustHeight} from "../directives/adjust.height";
import {ArquivoDigitalService} from "../services/arquivo.digital.service";
import {GlobalLoadingIndicator} from "../../core/codec/decorator/global.loading.indicator.decorator";
import {GoogleDriveService} from "../services/google.drive.service";
import {DomHandler} from "../../app/services/dom.handler";
import {LazyComponentLoaderService} from "../../core/commons/services/lazy.component.loader.service";
import {ReportViewParameters} from "../../cadastros-gerais/classes/report.view.parameters";

let genId = 0;

@Component({
    selector: 'relatorio-grupo',
    styleUrls: ['relatorio.grupo.component.scss'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './relatorio.grupo.component.html'
})
export class RelatorioGrupoComponent extends BaseComponent implements AdjustHeight {

    private _groupName: string;

    private _tipoItem: RelatorioGrupoItemTipoEnum;

    private _relatorioGrupo: RelatorioGrupo;

    private _tipoArquivo: RelatorioGrupoTipoArquivoEnum;

    private _report: ReportAngularMenuVO;

    private editingItem: RelatorioGrupoItem;

    private currentComponentType: any;

    private currentDocType: RelatorioGrupoTipoArquivoEnum;

    relatorioGrupoId = genId++;

    @Input()
    heightToolbar: number = 36;

    @Input()
    cloneGoogleDocs: boolean = false;

    @Input()
    showSelectionControls: boolean = true;

    @Input()
    allowItemReordering: boolean = true;

    @Input()
    selectionMode: string = "single";

    @Input()
    idArquivoDigital: number;

    @Input()
    get groupName(): string {
        return this._groupName;
    }

    set groupName(value: string) {
        this._groupName = value;
        if (value && value.trim() != "") {
            this.of(this.relatorioGrupoService.getGroupConfig(value), (reportsCfg: ReportAngularMenuVO[]) => {
                this.reportsCfg = reportsCfg;
            });
        }
    }

    @Input()
    get relatorioGrupo(): RelatorioGrupo {
        return this._relatorioGrupo;
    }

    set relatorioGrupo(value: RelatorioGrupo) {
        if (this._relatorioGrupo != value) {
            this._relatorioGrupo = value;
            if (value && value.itens) {
                this.datasource = value.itens.slice();
            } else {
                this.loadDatasource();
            }

            this.relatorioGrupoChange.emit(value);
        }
    }

    @Output()
    relatorioGrupoChange: EventEmitter<RelatorioGrupo> = new EventEmitter();

    @Input()
    parentContext: any;

    @Input()
    titulo: string = "Grupo de Relatórios";

    @Input()
    popupTitulo: string = "Edição de Relatório";

    private _disabled: boolean = false;

    get disabled(): boolean {
        return this._disabled;
    }

    @Input()
    set disabled(value: boolean) {
        this._disabled = value;
        this.allowItemReordering = !value;
    }

    @ViewChild(RelatorioHostDirective, { static: true })
    relatorioHost: RelatorioHostDirective;

    @ViewChild("fileList", { static: true })
    fileList: DxListComponent;

    @ViewChild(DxDropDownBoxComponent)
    relatorioDropDown: DxDropDownBoxComponent;

    @ViewChild(DxTreeViewComponent)
    treeView;

    itemTypeEnum = RelatorioGrupoItemTipoEnum;

    fileTypeEnum = RelatorioGrupoTipoArquivoEnum;

    reportsCfg: ReportAngularMenuVO[] = [];

    datasource: RelatorioGrupoItem[] = [];

    // form config

    get tipoItem(): RelatorioGrupoItemTipoEnum {
        return this._tipoItem;
    }

    set tipoItem(value: RelatorioGrupoItemTipoEnum) {
        this._tipoItem = value;
        this.configuraItem();
    }

    get tipoArquivo(): RelatorioGrupoTipoArquivoEnum {
        return this._tipoArquivo;
    }

    set tipoArquivo(value: RelatorioGrupoTipoArquivoEnum) {
        this._tipoArquivo = value;
        this.configuraItem();
    }

    get report(): ReportAngularMenuVO {
        return this._report;
    }

    set report(value: ReportAngularMenuVO) {
        //Se menu selecionado possui ReportAngularComponentVO e report selecionado é diferente do atual
        if (value && value.componentVO && this._report != value) {
            this._report = value;
            this.configuraItem();
        }
    }

    itemTitulo: string;

    itemLegislacao: string;

    exibeSelecaoTipoArquivo: boolean = false;

    exibeSelecaoRelatorio: boolean = false;

    exibeBotaoImprimir: boolean = false;

    exibeTitulo: boolean = false;

    // -- fim form config

    itemPopupVisible: boolean = false;

    reportComponent: AbstractReport<any>;

    docsComponent: GoogleDocsComponent;

    @ViewChild("ArquivoDigitalComponent")
    arqDigitalComponent: ArquivoDigitalComponent;

    loadingVisible: boolean = false;

    selectedItems: RelatorioGrupoItem[] = [];

    constructor(private _injector: Injector,
                private componentFactoryResolver: ComponentFactoryResolver,
                private lazyComponentLoaderService: LazyComponentLoaderService,
                private jacksonService: JacksonService,
                private messageService: MessageBoxUiService,
                private reportWatcherService: ReportWatcherService,
                private arquivoDigitalService: ArquivoDigitalService,
                private relatorioGrupoService: RelatorioGrupoService,
                private googleDriveService: GoogleDriveService,
                private domHandler: DomHandler,
                private relatorioGrupoItemService: RelatorioGrupoItemService) {
        super(_injector);
    }


    onContentReady(event: any) {
        //Adicionar o icone de reorder a esquerda da lista
        const $ = this.domHandler.jQuery;
        $('.dx-item.dx-list-item').each(function (i, a) {
            $(a).children('.dx-list-reorder-handle-container').each(function (ii, b) {
                $(a).prepend(b)
            })
        })
    }

    imprimirGrupo() {

        if (this.idArquivoDigital) {
            this.arquivoDigitalService.imprimirArquivoDigital(this.idArquivoDigital);
        } else {
            this.loadingVisible = true;
            this.of(this.relatorioGrupoService.geraRelatorio(this.relatorioGrupo), relatorioVO => {
                this.addReportToQueue(relatorioVO);
            });
        }

    }

    private addReportToQueue(relatorioVO) {
        this.reportWatcherService.addReportToQueue(relatorioVO,
            {viewMode: "OPEN_NEW_WINDOW", onComplete: () => this.loadingVisible = false, exceptionHandler: (error) => {
                    this.hasError.emit(error);
                    this.loadingVisible = false;
                    return true;
                }});
    }

    imprimirItem(event: any, data: any) {

        this.loadingVisible = true;

        this.of(this.relatorioGrupoItemService.geraRelatorio(data), relatorioVO => {
            this.addReportToQueue(relatorioVO);
        });

    }

    imprimirRelatorioCorrente() {

        let item = new RelatorioGrupoItem();

        if (this.reportComponent) {
            this.reportComponent.showLoading();
        }

        const observable = this.populaItem(item).pipe(
            filter(i => !this._.isNil(i)),
            switchMap(i => this.relatorioGrupoItemService.geraRelatorio(i))
        );

        this.of(observable, relatorioVO =>
            this.reportWatcherService.addReportToQueue(relatorioVO,
                {viewMode: "OPEN_NEW_WINDOW", onComplete: () => this.reportComponent.hideLoading(), exceptionHandler: (error) => {
                        this.hasError.emit(error);
                        this.loadingVisible = false;
                        return true;
                    }}));

    }

    adicionarItem() {
        this.clearItemForm();
        this.itemPopupVisible = true;
    }

    configuraItem() {

        this.exibeBotaoImprimir = false;
        this.exibeTitulo = false;

        if (!this._tipoItem) {
            this.exibeSelecaoRelatorio = false;
            this.exibeSelecaoTipoArquivo = false;
            return;
        }

        if (this._tipoItem == RelatorioGrupoItemTipoEnum.ARQUIVO) {

            this.exibeSelecaoTipoArquivo = true;
            this.exibeSelecaoRelatorio = false;
            this.exibeTitulo = true;

            if (!this._tipoArquivo) {
                //clear components that was changed
                this.reportComponent = null;
                this._report = null;
                return;
            }

            if (this._tipoArquivo == RelatorioGrupoTipoArquivoEnum.UPLOAD) {

                this.createArqDigitalComponent(this.editingItem);

            } else {

                this.createDocsComponent(this._tipoArquivo, this.editingItem);

            }

        } else {

            this.exibeSelecaoRelatorio = true;
            this.exibeSelecaoTipoArquivo = false;

            if (!this._report) {
                this.exibeBotaoImprimir = false;

                //clear components that was changed
                this.arqDigitalComponent = null;
                this.docsComponent = null;
                this._tipoArquivo = null;
                return;
            }
            this.exibeBotaoImprimir = true;
            this.exibeTitulo = true;
        }

    }

    editarItem(event: any, data: any) {
        this.clearItemForm();
        this.editingItem = data;
        this.exibeTitulo = true;
        this.itemTitulo = this.editingItem.titulo;
        this.itemLegislacao = this.editingItem.legislacao;
        this._tipoItem = this.editingItem.tipo;
        if (this._tipoItem == RelatorioGrupoItemTipoEnum.RELATORIO) {
            this._report = this.reportsCfg.filter(r => r.componentVO && r.componentVO.reportName == this.editingItem.reportName)[0];
            this.exibeSelecaoTipoArquivo = false;
            this.exibeSelecaoRelatorio = true;
            this.exibeBotaoImprimir = true;
            this.createReportComponent(this._report, this.editingItem);
        } else {
            this._tipoArquivo = this.editingItem.tipoArquivoDigital;
            this.exibeSelecaoTipoArquivo = true;
            this.exibeSelecaoRelatorio = false;
            this.exibeBotaoImprimir = false;
            if (this._tipoArquivo == RelatorioGrupoTipoArquivoEnum.UPLOAD) {
                this.createArqDigitalComponent(this.editingItem);
            } else {
                if(this.cloneGoogleDocs) {
                    this.cloneArquivoDigital(this.editingItem.idArquivoDigital).subscribe(arquivo => {
                        this.editingItem.idArquivoDigital = arquivo.id;
                        this.currentComponentType = null;
                        this.createDocsComponent(this._tipoArquivo, this.editingItem);
                    });
                } else {
                    this.createDocsComponent(this._tipoArquivo, this.editingItem);
                }
            }
        }
        this.itemPopupVisible = true;

    }

    @GlobalLoadingIndicator
    cloneArquivoDigital(idArquivoDigital: number) {
        return this.of(this.arquivoDigitalService.clone(this.editingItem.idArquivoDigital));
    }

    removerItem(event: any, data: any) {
        this.datasource = this.datasource.filter(i => i.ordem != data.ordem);

        setTimeout(() => {
            this._relatorioGrupo.itens = this.datasource;
            this.normalizaOrdenacao();
            this.relatorioGrupoChange.emit(this._relatorioGrupo);
        });
    }

    normalizaOrdenacao() {
        if (this.relatorioGrupo && !_.isEmpty(this.relatorioGrupo.itens)) {
            this.relatorioGrupo.itens.sort((a, b) => a.ordem - b.ordem);
            let ordem = 0;
            this.relatorioGrupo.itens.forEach(value => {
                value.ordem = ordem++;
            })
        }
    }


    loadDatasource(): void {

        if (this._relatorioGrupo && this._relatorioGrupo.id) {
            this.of(this.relatorioGrupoItemService.getPorRelatorioGrupo(this._relatorioGrupo.id), datasource => {
                datasource.sort((a, b) => a.ordem - b.ordem);
                this._relatorioGrupo.itens = datasource;
                this.datasource = datasource
            });
        } else {
            this.datasource = [];
        }

    }

    createArqDigitalComponent(item: RelatorioGrupoItem) {

        const componentType = ArquivoDigitalComponent;

        if (componentType == this.currentComponentType) {
            return;
        }

        this.currentComponentType = componentType;

        const componentRef = this.createComponentInstance(componentType);

        this.arqDigitalComponent = componentRef.instance as ArquivoDigitalComponent;
        this.arqDigitalComponent.arquivoUnico = true;
        this.arqDigitalComponent.filtroTipo = "application/pdf";
        this.arqDigitalComponent.allowedFileExtensions = ["pdf", "xlsx", "docx"];
        this.arqDigitalComponent.marginLeftFileUploader = 160;

        if (item && item.idArquivoDigital) {
            this.arqDigitalComponent.arquivosId = [item.idArquivoDigital];

            this.of(this.arquivoDigitalService.getById(item.idArquivoDigital),  result => {
                this.arqDigitalComponent.arquivos.push(result)
                this.arqDigitalComponent.updateFileListDataSource(this.arqDigitalComponent.arquivos);
            })
        }
    }

    createDocsComponent(tipoDoc: RelatorioGrupoTipoArquivoEnum, item: RelatorioGrupoItem) {

        const componentType = GoogleDocsComponent;

        if (componentType == this.currentComponentType && tipoDoc == this.currentDocType) {
            return;
        }

        this.currentComponentType = componentType;
        this.currentDocType = tipoDoc;

        const componentRef = this.createComponentInstance(componentType);

        this.docsComponent = componentRef.instance as GoogleDocsComponent;

        if (item && item.idArquivoDigital) {
            this.docsComponent.idArquivoDigital = item.idArquivoDigital;
        }

        let tipo = item && item.tipoArquivoDigital ? item.tipoArquivoDigital : tipoDoc;

        if (tipo) {

            if (tipo == RelatorioGrupoTipoArquivoEnum.XLSX) {
                this.docsComponent.fileType = GoogleDriveFileTypeEnum.PLANILHA;
            } else {
                this.docsComponent.fileType = GoogleDriveFileTypeEnum.TEXTO;
            }

        }

        this.docsComponent.savePrint = true;

        this.docsComponent.loadEditor();

    }

    createReportComponent(report: ReportAngularMenuVO, item: RelatorioGrupoItem) {

        if (report.componentVO) {

            if (!report.componentVO.moduleName) {
                const error = `O componente ${report.componentVO.componentName} não possúi moduleName registrado. Verifique o arquivo module-reports.xml correspondente.`;
                console.error(error);
                this.messageService.showError(error);
                return;
            }

            this.loadingVisible = true;

            const componentType = getReportType(report.componentVO.componentName);

            if (componentType == this.currentComponentType) {

                if (this.reportComponent && this.reportComponent.reportComponent) {

                    if(this.reportComponent.filter.parameters) {
                        this.reportComponent.filter.parameters.reportName = this.report.componentVO.reportName;
                    } else {
                        this.reportComponent.filter.parameters = new ReportViewParameters();
                        this.reportComponent.filter.parameters.reportName = this.report.componentVO.reportName;
                    }

                    this.lazyComponentLoaderService.selectReport(this.reportComponent, this.report.componentVO.reportName);
                }

                this.loadingVisible = false;
                return;
            }

            this.currentComponentType = componentType;

            this.createLazyComponentInstance(report.componentVO.moduleName, componentType)
                .then(componentRef => {
                    this.reportComponent = componentRef.instance as AbstractReport<any>;

                    this.lazyComponentLoaderService.selectReport(this.reportComponent, this.report.componentVO.reportName);

                    let filter: AbstractReportFilterVO = null;

                    if(!!componentRef.instance.filter) {
                        filter = new componentRef.instance.filter.constructor;
                    }

                    if (item && item.filter && item.filterType) {

                        filter = this.jacksonService.decode(JSON.parse(item.filter),
                            jacksonMetadata.getJacksonType(item.filterType.substr(item.filterType.lastIndexOf('.') + 1)));

                    }

                    if(filter.parameters) {
                        filter.parameters.reportName = this.report.componentVO.reportName;
                    } else {
                        filter.parameters = new ReportViewParameters();
                        filter.parameters.reportName = this.report.componentVO.reportName;
                    }

                    this.reportComponent.embedded = true;
                    setTimeout(() => {
                        if (filter) {
                            this.reportComponent.filter = filter;
                        }
                        this.reportComponent.loadEmbeddedContext(filter, this.parentContext);
                        this.loadingVisible = false;
                    });

                }, error => {
                    console.log(error);
                    this.messageService.showError("Falha ao carregar componente: " + componentType);
                });

        } else {
            const error = `O item ${report.nome}, não é um report válido.`;
            console.error(error);
        }

    }

    onPopupAceitar() {

        if (!this._tipoItem) {
            return;
        }

        if (this._tipoItem == RelatorioGrupoItemTipoEnum.ARQUIVO && !this._tipoArquivo) {
            return;
        }

        if (this._tipoItem == RelatorioGrupoItemTipoEnum.RELATORIO && !this._report) {
            return;
        }

        if (this._tipoItem == RelatorioGrupoItemTipoEnum.ARQUIVO
            && this._tipoArquivo == RelatorioGrupoTipoArquivoEnum.UPLOAD
            && (!this.arqDigitalComponent.arquivos || this.arqDigitalComponent.arquivos.length == 0)) {
            return;
        }

        if (this._tipoItem == RelatorioGrupoItemTipoEnum.ARQUIVO
            && this._tipoArquivo == RelatorioGrupoTipoArquivoEnum.UPLOAD
            && !_.isEmpty(this.arqDigitalComponent.arquivos)) {
            this.arqDigitalComponent.arquivos.forEach(arquivo => this.arqDigitalComponent.arquivosId.push(arquivo.id) );
        }

        if (!this._relatorioGrupo) {
            this._relatorioGrupo = new RelatorioGrupo();
            this._relatorioGrupo.titulo = this.titulo;
        }

        this._relatorioGrupo.groupName = this._groupName;

        let novo: boolean = !this.editingItem;

        if (novo) {

            this.editingItem = new RelatorioGrupoItem();

        }

        this.of(this.populaItem(this.editingItem).pipe(filter(i => !this._.isNil(i))), item => {

            if (novo) {
                this.addItem(item);
            }
            this.relatorioGrupoChange.emit(this._relatorioGrupo);
            this.itemPopupVisible = false;

        });

    }

    private populaItem(item: RelatorioGrupoItem): Observable<RelatorioGrupoItem> {

        item.titulo = !this.itemTitulo || _.isEmpty(this.itemTitulo.trim()) ? undefined : this.itemTitulo;
        item.legislacao = !this.itemLegislacao || _.isEmpty(this.itemLegislacao.trim()) ? undefined : this.itemLegislacao;

        if (this.docsComponent) {

            return this.docsComponent.commitFile().pipe(map(idArquivo => {

                item.tipo = RelatorioGrupoItemTipoEnum.ARQUIVO;
                item.tipoArquivoDigital = this.docsComponent.fileType == GoogleDriveFileTypeEnum.PLANILHA ?
                    RelatorioGrupoTipoArquivoEnum.XLSX : RelatorioGrupoTipoArquivoEnum.DOCX;
                item.idArquivoDigital = idArquivo;

                return item;

            }));

        } else if (this.arqDigitalComponent) {
            item.tipo = RelatorioGrupoItemTipoEnum.ARQUIVO;

            if (!_.isNil(this.arqDigitalComponent.arquivos) && !_.isEmpty(this.arqDigitalComponent.arquivos)){
                var mimeType = this.arqDigitalComponent.arquivos[0].mimeType;
                if(mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
                    item.tipoArquivoDigital = RelatorioGrupoTipoArquivoEnum.DOCX;
                } else if (mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    item.tipoArquivoDigital = RelatorioGrupoTipoArquivoEnum.XLSX;
                } else {
                    item.tipoArquivoDigital = RelatorioGrupoTipoArquivoEnum.UPLOAD;
                }
            } else {
                item.tipoArquivoDigital = RelatorioGrupoTipoArquivoEnum.UPLOAD;
            }
            item.idArquivoDigital = this.arqDigitalComponent.arquivosId[0];
            item.legislacao = this.itemLegislacao;

            //se título não informado, então o default name será o nome do arquivo carregado
            if (_.isEmpty(this.itemTitulo)) {

                let fileName = this.arqDigitalComponent.arquivos[0].nomeArquivo;
                fileName = fileName.replace(/\.[^/.]+$/, "");

                item.titulo = fileName;
            }

            return of(item);

        } else if (this.reportComponent) {

            if (!this.reportComponent.reportComponent.validateFilterForm()) {
                return of(null);
            }

            let filter = this.reportComponent.getFilter();

            if (!this.reportComponent.canDoFilter(filter)) {
                return of(null);
            }

            if (!filter || !filter['__typeId__']) {
                const ex = new ExceptionInfo();
                if (!filter) {
                    ex.exceptionMessage = `${this._report.componentVO.componentName}.filter == null`;
                } else {
                    ex.exceptionMessage = `${this._report.componentVO.componentName}.filter não é instância de uma classe anotada com @JacksonType`;
                }

                return throwError(ex);
            }

            if (!(filter instanceof AbstractReportFilterVO)) {
                const ex = new ExceptionInfo();
                ex.exceptionMessage = `${this._report.componentVO.componentName}.filter não estende AbstractReportFilterVO`;
            }

            (filter as AbstractReportFilterVO).parameters.reportName = this._report.componentVO.reportName;
            (filter as AbstractReportFilterVO).parameters.tituloCustomizado = item.titulo;
            (filter as AbstractReportFilterVO).parameters.legislacaoCustomizado = item.legislacao;

            const filterType: string = jacksonMetadata.getKey(filter.constructor);

            if (!filterType) {
                const ex = new ExceptionInfo();
                ex.exceptionMessage = `${this._report.componentVO.componentName}.filter não é instância de uma classe anotada com @JsonSubType (filter deve estender AbstractReportFilterVO)`;
                return throwError(ex);
            }

            const filterString = this.jacksonService.encodeToJson(filter);

            item.tipo = RelatorioGrupoItemTipoEnum.RELATORIO;
            item.filterType = filterType;
            item.filter = filterString;
            item.reportName = this._report.componentVO.reportName;
            item.reportTitle = this._report.componentVO.reportTitle;

            return of(item);

        }

        const ex = new ExceptionInfo();
        ex.exceptionMessage = "Tipo de relatório inválido";
        return throwError(ex);

    }

    private addItem(item: RelatorioGrupoItem) {
        if (this._.isNil(item.ordem)) {
            item.ordem = this.datasource.length;
        }
        this.datasource.push(item);
        this.datasource.sort((a, b) => a.ordem - b.ordem);
        this._relatorioGrupo.itens = this.datasource;
    }

    onPopupCancelar() {

        this.finalizaEdicao();

    }

    finalizaEdicao() {

        this.editingItem = null;
        this.itemPopupVisible = false;

        const viewContainerRef = this.relatorioHost.viewContainerRef;
        viewContainerRef.clear();

        this.reportComponent = null;
        this.docsComponent = null;
        this.arqDigitalComponent = null;

    }


    onItemReordered(event: any) {

        const from = event.fromIndex;
        const to = event.toIndex;

        this.datasource
            .filter(item => (item.ordem >= from && item.ordem <= to) || (item.ordem >= to && item.ordem <= from))
            .forEach(item => from < to ? item.ordem-- : item.ordem++);

        event.itemData.ordem = to;

        // Importante para manter a ordem de index na lista
        this.relatorioGrupo.itens = this.datasource.slice().sort((a, b) => a.ordem - b.ordem)
        this.relatorioGrupoChange.emit(this._relatorioGrupo);
    }

    moveUp() {
        if (!this.selectedItems || this.selectedItems.length == 0) {
            return;
        }

        const move = this.selectedItems[0];

        if (move.ordem == 0) {
            return;
        }

        const from = move.ordem;
        const to = move.ordem - 1;

        this.fileList.instance.reorderItem(from, to);
    }

    moveDown() {
        if (!this.selectedItems || this.selectedItems.length == 0) {
            return;
        }

        const move = this.selectedItems[0];

        if (move.ordem >= this.datasource.length - 1) {
            return;
        }

        const from = move.ordem;
        const to = move.ordem + 1;
        this.fileList.instance.reorderItem(from, to);
    }

    adjustHeight(height: number) {
        if (this.fileList) {
            this.fileList.height = height - 40;
        }
        if (this.fileList.instance) {
            this.fileList.instance.reload();
        }
    }

    syncTreeViewSelection(event) {
        if (!this.treeView) return;

        if (!this.report) {
            this.treeView.instance.unselectAll();
        } else {
            this.treeView.instance.selectItem(this.report);
        }
    }

    onReportSelected(event) {
        this.report = event.itemData;
        this.relatorioDropDown.instance.close();
        this.createReportComponent(this._report, this.editingItem);
    }

    private createLazyComponentInstance(moduleName: string, componentType: any): Promise<any> {

        const viewContainerRef = this.relatorioHost.viewContainerRef;

        return this.lazyComponentLoaderService.createLazyReportComponentInstance(moduleName, componentType, viewContainerRef);

    }

    private createComponentInstance(componentType) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

        const viewContainerRef = this.relatorioHost.viewContainerRef;
        viewContainerRef.clear();

        return viewContainerRef.createComponent(componentFactory);
    }

    private clearItemForm() {
        this._tipoItem = null;
        this._tipoArquivo = null;
        this._report = null;
        this.editingItem = null;
        this.exibeSelecaoTipoArquivo = false;
        this.exibeSelecaoRelatorio = false;
        this.exibeBotaoImprimir = false;
        this.exibeTitulo = false;

        this.relatorioHost.viewContainerRef.clear();
        this.docsComponent = null;
        this.reportComponent = null;
        this.arqDigitalComponent = null;
        this.currentDocType = null;
        this.currentComponentType = null;

        this.itemTitulo = null;
        this.itemLegislacao = null;
    }

    protected getToolbarHeight(): number {
        return this.heightToolbar;
    }

}
