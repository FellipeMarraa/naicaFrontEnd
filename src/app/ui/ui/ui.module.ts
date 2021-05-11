import {LOCALE_ID, NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, registerLocaleData} from "@angular/common";
import {MessageBoxUiService} from "./services/message.box.ui.service";
import {EventBindDirective} from "./directives/event.bind.directive";
import {ArrayModReducePipe} from "./pipes/array.mod.reduce.pipe";
import {ArrayKeyFilterPipe} from "./pipes/array.key.filter.pipe";
import {SubArrayKeyFilterPipe} from "./pipes/subarray.key.filter.pipe";
import {NgForEmphasisOf} from "./directives/ng.for.emphasis";
import {FirstKeysToConsolePipe} from './pipes/first.keys.to.console.pipe';
import {JsonfPipe} from "./pipes/jsonf";
import {FormsModule} from "@angular/forms";
import {ClassicModalComponent} from './classic-modal/classic.modal.component';
import {GraphComponent} from "./graph/graph.component";
import {GraphWhenComponent} from './graph/graph.when.component';
import {GraphDefaultComponent} from './graph/graph.main.component';
import {GraphService} from './services/graph.service';
import {CamelCasePipe} from './pipes/camel.case.pipe';
import {CapitalCamelCaseSpacedPipe} from './pipes/capital.camel.case.spaced.pipe';
import {TestGraphComponent} from './graph/test.graph.component';
import {TestGraphInlineComponent} from './graph/test.graph.inline.component';
import {GraphEmbeddableDirective} from './graph/graph.embeddable.directive';
import {AnoSeletorComponent} from "./ano-seletor/ano.seletor.component";
import {SVGService} from './services/svg.service';
import {CamelCaseToCapitalPipe} from "./pipes/camel.case.to.capital.pipe";
import {WizardComponent} from "./wizard/wizard.component";
import {WizardStepComponent} from "./wizard/wizard.step.component";
import {MesSeletorComponent} from "./mes-seletor/mes.seletor.component";
import {ClassicDynamicModalComponent} from "./classic-dynamic-modal/classic.dynamic.modal.component";
import {ZoomWithPopupService} from "./services/zoom.with.popup.context";
import {GraphToolbarComponent} from "./graph-toolbar/graph.toolbar.component";
import {BaseRouteViewComponent} from "./base-route-view/base.route.view.component";
import {CrudComponent} from "./crud/crud.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {EditToolbarComponent} from "./edit-toolbar/edit.toolbar.component";
import {ListToolbarComponent} from "./list-toolbar/list.toolbar.component";
import {TestCrudComponent} from "./crud/test-crud/test.crud.component";
import {ActionButtonComponent} from "./action-button/action.button.component";
import {ToolbarLeftSectionComponent} from "./toolbar/toolbar.left.section.component";
import {ToolbarRightSectionComponent} from "./toolbar/toolbar.right.section.component";
import {DxChartWrapper} from "./dx-chart-wrapper/dx.chart.wrapper";
import {NgIfCallback} from "./ng-if-callback/ng.if.callback";
import {TabPanelComponent} from "./tab-panel/tab-panel.component";
import {TabComponent} from "./tab-panel/tab.component";
import {MessagePanelComponent} from "./message-panel/message-panel.component";
import {ExceptionInfoService} from "./services/exception.info.service";
import {GlobalLoadPanelComponent} from "./global-load-panel/global.load.panel.component";
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";
import {ContextBarComponent} from "./context-bar/context.bar.component";
import {GridToolbarComponent} from "./grid-toolbar/grid.toolbar.component";
import {YesNoDropdownComponent} from "./yes-no-dropdown/yes.no.dropdown.component";
import {HostComponentProvider} from "./directives/host.component.provider";
import {DxiCheckBoxAlignmentDirective} from "./directives/dxi.check.box.alignment.directive";
import {SelectBoxEnumBasedComponent} from "./select-box-enum-based/select.box.enum.based.component";
import {PropagateElementAttrToInputDirective} from "./directives/propagate.elementAttr.to.input.directive";
import {CustomDataGridComponent} from "./custom-data-grid/custom.data.grid.component";
import {AutocompleteGridComponent} from "./autocomplete/autocomplete.grid.component";
import {GridFocusDirective} from "./directives/grid.focus.directive";
import {GridRowDoubleClickDirective} from "./directives/grid.row.double.click.directive";
import {ReportComponent} from "./report/report.component";
import {ReportToolbarComponent} from "./report/report.toolbar.component";
import {SimNaoPrintPipe} from "./pipes/sim.nao.print.pipe";
import {ToastUiService} from "./services/toast.ui.service";
import {ReportService} from "./services/report.service";
import {DxAutoHeightDirective} from "./directives/dx.auto.height.directive";
import {AutoHeightDirective} from "./directives/auto.height.directive";
import {LocalIpService} from "./services/local.ip.service";
import {PrintComponent} from "./print-component/print.component";
import {MonetaryInputComponent} from "./monetary-input/monetary.input.component";
import ptBr from "@angular/common/locales/pt";
import {ArquivoDigitalComponent} from "./arquivo-digital/arquivo.digital.component";
import {ArquivoDigitalService} from "./services/arquivo.digital.service";
import {MessageDetailsPopupComponent} from "./message-details-popup/message.details.popup.component";
import {CkeditorComponent} from "./ckeditor/ckeditor.component";
import {CurrencyPtBRPipe} from "./pipes/currency.pt.br.pipe";
import {InputOnlyNumberDirective} from "./directives/input.only.number.directive";
import {DxAutoWidthDirective} from "./directives/dx.auto.width.directive";
import {DxAutoSizeDirective} from "./directives/dx.auto.size.directive";
import {AutoWidthDirective} from "./directives/auto.width.directive";
import {AutoSizeDirective} from "./directives/auto.size.directive";
import {DataFieldInfoComponent} from "./detail-info/data.field.info.component";
import {PopupComponent} from "./popup/popup.component";
import {CommonsAppModule} from "../core/commons/commons.app.module";
import {UiPrintService} from "./services/ui.print.service";
import {DateRangeComponent} from "./date-range/date.range.component";
import {FocusAfterViewInitDirective} from "./directives/focus.after.view.init.directive";
import {TestInputComponent} from "./test-input/test.input.component";
import {PropagateEventGloballyDirective} from "./directives/propagate.event.globally.directive";
import {FieldSetComponent} from "./field-set/field.set.component";
import {PopupInnerContentComponent} from "./popup-inner-content/popup.inner.content.component";
import {TarefaProgressBarComponent} from "./tarefa-progress-bar/tarefa.progress.bar.component";
import {TarefaService} from "../core/commons/services/tarefa.service";
import {InputDateDirective} from "./directives/input.date.directive";
import {RelatorioGrupoComponent} from "./relatorio-grupo/relatorio.grupo.component";
import {YoutubePopupPlayerComponent} from "./youtube-player/youtube.popup.player.component";
import {CustomTreeListComponent} from "./custom-tree-list/custom.tree.list.component";
import {RelatorioHostDirective} from "./relatorio-grupo/relatorio.host.directive";
import {GoogleDriveService} from "./services/google.drive.service";
import {GoogleDocsComponent} from "./google-docs/google.docs.component";
import {SelectBoxEntityBasedComponent} from "./select-box-entity-based/select.box.entity.based.component";
import {DxCheckBoxIndeterminateDirective} from "./directives/dx.check.box.indeterminate.directive";
import {ContextBarDirective} from "./directives/context.bar.directive";
import {TooltipHelperComponent} from "./tooltip-helper/tooltip.helper.component";
import {CepPipe} from "./pipes/cep.pipe";
import {FormatMoeda} from "./directives/format.moeda";
import {DockerPullComponent} from "./docker/docker.pull.component";
import {DockerPullLayerComponent} from "./docker/docker.pull.layer.component";
import {SonLock} from "./services/son.lock";
import {CpfCnpjPipe} from "./pipes/cpf.cnpj.pipe";
import {UsuarioAutocompleteComponent} from "./usuario-seletor/usuario.seletor.component";
import {NotaVersaoComponent} from "../gerenciador/nota-versao/nota.versao.component";
import {PdfViewerComponent} from "./pdf-viewer/pdf-viewer.component";
import {SafePipe} from "./pipes/safe";
import {BaseViewComponent} from "./base-view/base.view.component";
import {TarefaStatusIndicatorComponent} from "./tarefa-status-indicator/tarefa.status.indicator.component";
import {TarefaProgressComponent} from "./tarefa-progress/tarefa.progress.component";
import {ArquivoDigitalDownloadButtonComponent} from "./arquivo-digital-button-download/arquivo.digital.download.button.component";
import {YoutubePlayerComponent} from "./youtube-player/youtube.player.component";
import {PublicidadeComponent} from "./publicidade/publicidade.component";
import {PublicidadeService} from "./services/publicidade.service";
import {UsuarioPublicidadeService} from "./services/usuario.publicidade.service";
import {ReCaptchaComponent} from "./captcha/re.captcha.component";
import {PaletteSelectorComponent} from "./palette-selector/palette.selector.component";
import {GoogleDocsMetadadoComponent} from "./google-docs-metadado/google.docs.metadado.component";
import {FormatNumberPipe} from "./pipes/format.number.pipe";
import {NumberUtilsService} from "../core/commons/services/number.utils.service";
import {NgxJsonViewerModule} from "ngx-json-viewer";
import {JsonComponent} from "./json/json.component";
import {TextoCkeditorPipe} from "./pipes/texto.ckeditor.pipe";
import {DxAccordionModule} from "devextreme-angular/ui/accordion";
import {DxValidatorModule} from "devextreme-angular/ui/validator";
import {DxFormModule} from "devextreme-angular/ui/form";
import {DxCalendarModule} from "devextreme-angular/ui/calendar";
import {DxTreeViewModule} from "devextreme-angular/ui/tree-view";
import {DxNumberBoxModule} from "devextreme-angular/ui/number-box";
import {DxGalleryModule} from "devextreme-angular/ui/gallery";
import {DxDateBoxModule} from "devextreme-angular/ui/date-box";
import {DxTextBoxModule} from "devextreme-angular/ui/text-box";
import {DxButtonModule} from "devextreme-angular/ui/button";
import {DxTagBoxModule} from "devextreme-angular/ui/tag-box";
import {DxDataGridModule} from "devextreme-angular/ui/data-grid";
import {DxLoadPanelModule} from "devextreme-angular/ui/load-panel";
import {DxLoadIndicatorModule} from "devextreme-angular/ui/load-indicator";
import {DxToolbarModule} from "devextreme-angular/ui/toolbar";
import {DxPopupModule} from "devextreme-angular/ui/popup";
import {DxScrollViewModule} from "devextreme-angular/ui/scroll-view";
import {DxTextAreaModule} from "devextreme-angular/ui/text-area";
import {DxAutocompleteModule} from "devextreme-angular/ui/autocomplete";
import {DxSelectBoxModule} from "devextreme-angular/ui/select-box";
import {DxDropDownBoxModule} from "devextreme-angular/ui/drop-down-box";
import {DxCheckBoxModule} from "devextreme-angular/ui/check-box";
import {DxBoxModule} from "devextreme-angular/ui/box";
import {DxRadioGroupModule} from "devextreme-angular/ui/radio-group";
import {DxSwitchModule} from "devextreme-angular/ui/switch";
import {DxListModule} from "devextreme-angular/ui/list";
import {DxFileUploaderModule} from "devextreme-angular/ui/file-uploader";
import {DxProgressBarModule} from "devextreme-angular/ui/progress-bar";
import {DxTreeListModule} from "devextreme-angular/ui/tree-list";
import {DxContextMenuModule} from "devextreme-angular/ui/context-menu";
import {DxTooltipModule} from "devextreme-angular/ui/tooltip";
import {DxColorBoxModule} from "devextreme-angular/ui/color-box";
import {DxTabPanelModule} from "devextreme-angular/ui/tab-panel";
import {DxMapModule} from "devextreme-angular/ui/map";
import {DxSchedulerModule} from "devextreme-angular/ui/scheduler";
import {DxPieChartModule} from "devextreme-angular/ui/pie-chart";
import {
    DxBulletModule,
    DxDiagramComponent,
    DxDiagramModule,
    DxLinearGaugeComponent,
    DxLinearGaugeModule,
    DxSliderComponent,
    DxSliderModule
} from "devextreme-angular";
import {FontAwesomeStyleDirective} from "./directives/font.awesome.style.directive";
import {SystemFlagComponent} from "./system-flag/system.flag.component";
import {InputUppercaseDirective} from "./directives/input.uppercase.directive";
import {SelectBoxGridEntityBased} from "./select-box-grid-entity/select-box-grid-entity-based/select.box.grid.entity.based";
import {SelectBoxTreeGridEntityBased} from "./select-box-grid-entity/select-box-tree-grid-entity-based/select.box.tree.grid.entity.based";
import {LabelTagComponent} from "./label-tag/label.tag.component";
import {AutoSizeContainerComponent} from "./auto-size-container/auto.size.container.component";
import {TagBoxBasedComponent} from "./tag-box-based/tag.box.based.component";
import {PopupService} from "./services/popup.service";
import {
    DxiGroupComponent,
    DxiGroupModule,
    DxiRangeComponent,
    DxiRangeModule,
    DxoAutoLayoutComponent,
    DxoAutoLayoutModule,
    DxoEdgesComponent,
    DxoEdgesModule,
    DxoMainToolbarComponent,
    DxoMainToolbarModule,
    DxoNodesComponent,
    DxoNodesModule,
    DxoPropertiesPanelComponent,
    DxoPropertiesPanelModule,
    DxoRangeContainerComponent,
    DxoRangeContainerModule,
    DxoScaleComponent,
    DxoScaleModule,
    DxoSubvalueIndicatorComponent,
    DxoSubvalueIndicatorModule,
    DxoTickComponent,
    DxoTickModule,
    DxoToolbarComponent,
    DxoToolbarModule,
    DxoToolboxComponent,
    DxoToolboxModule,
    DxoValueIndicatorComponent,
    DxoValueIndicatorModule,
    DxoViewToolbarComponent,
    DxoViewToolbarModule
} from "devextreme-angular/ui/nested";
import {ArquivoDigitalPreviewService} from "./services/arquivo.digital.preview.service";
import {ArquivoDigitalPreviewComponent} from "./arquivo-digital-preview/arquivo.digital.preview.component";
import {SistemaService} from "./services/sistema.service";
import {SistemasAutorizadosSeletorComponent} from "../user/sistemas-autorizados-seletor/sistemas.autorizados.seletor.component";
import {ProgressoPipe} from "./pipes/progresso.pipe";

registerLocaleData(ptBr);

@NgModule({
    imports: [
        CommonsAppModule,
        DxAccordionModule,
        CommonModule,
        FormsModule,
        DxFormModule,
        DxCalendarModule,
        DxTreeViewModule,
        DxNumberBoxModule,
        DxGalleryModule,
        DxBulletModule,
        DxDateBoxModule,
        DxValidatorModule,
        DxTextBoxModule,
        DxButtonModule,
        DxTagBoxModule,
        DxDataGridModule,
        DxLoadPanelModule,
        DxLoadIndicatorModule,
        DxToolbarModule,
        DxPopupModule,
        DxScrollViewModule,
        DxTextAreaModule,
        DxAutocompleteModule,
        DxSelectBoxModule,
        DxDropDownBoxModule,
        DxCheckBoxModule,
        DxBoxModule,
        DxRadioGroupModule,
        DxSwitchModule,
        DxListModule,
        DxFileUploaderModule,
        DxProgressBarModule,
        DxTreeListModule,
        DxContextMenuModule,
        DxTooltipModule,
        DxColorBoxModule,
        DxTabPanelModule,
        DxMapModule,
        DxSchedulerModule,
        DxPieChartModule,
        DxSliderModule,
        DxMapModule,
        DxDiagramModule,
        DxoToolbarModule,
        DxoToolboxModule,
        DxoToolboxModule,
        DxoToolbarModule,
        DxoMainToolbarModule,
        DxoViewToolbarModule,
        DxoNodesModule,
        DxoAutoLayoutModule,
        DxoPropertiesPanelModule,
        DxoEdgesModule,
        DxiGroupModule,
        DxLinearGaugeModule,
        DxoSubvalueIndicatorModule,
        DxoValueIndicatorModule,
        DxoRangeContainerModule,
        DxiRangeModule,
        DxoScaleModule,
        DxoTickModule,
        NgxJsonViewerModule
    ],
    providers: [
        {provide: LOCALE_ID, useValue: 'pt-BR'},
        CurrencyPipe,
        CurrencyPtBRPipe,
        ZoomWithPopupService,
        MessageBoxUiService,
        GraphService,
        SonLock,
        SVGService,
        ArrayKeyFilterPipe,
        ExceptionInfoService,
        ToastUiService,
        ReportService,
        LocalIpService,
        UiPrintService,
        ArquivoDigitalService,
        TarefaService,
        GoogleDriveService,
        CepPipe,
        CpfCnpjPipe,
        PublicidadeService,
        UsuarioPublicidadeService,
        NumberUtilsService,
        PopupService,
        ArquivoDigitalPreviewService,
        SistemaService
    ],
    entryComponents: [ClassicDynamicModalComponent, GoogleDocsComponent, ArquivoDigitalComponent, NotaVersaoComponent],
    exports: [
        SystemFlagComponent,
        FontAwesomeStyleDirective,
        CustomDataGridComponent,
        DxAccordionModule,
        SimNaoPrintPipe,
        ProgressoPipe,
        PopupInnerContentComponent,
        FormsModule,
        CommonModule,
        DxGalleryModule,
        DxTreeViewModule,
        DxFormModule,
        DxBulletModule,
        DxCalendarModule,
        PropagateEventGloballyDirective,
        DxNumberBoxModule,
        DxValidatorModule,
        DxDateBoxModule,
        DxTextBoxModule,
        DxTagBoxModule,
        DxDataGridModule,
        DxLoadPanelModule,
        DxLoadIndicatorModule,
        DxToolbarModule,
        DxPopupModule,
        DxScrollViewModule,
        DxTextAreaModule,
        DxListModule,
        DxAutocompleteModule,
        DxSelectBoxModule,
        GlobalLoadPanelComponent,
        NgIfCallback,
        DxChartWrapper,
        ClassicDynamicModalComponent,
        MesSeletorComponent,
        NgForEmphasisOf,
        EventBindDirective,
        ArrayModReducePipe,
        ArrayKeyFilterPipe,
        BaseRouteViewComponent,
        SubArrayKeyFilterPipe,
        TextoCkeditorPipe,
        FirstKeysToConsolePipe,
        JsonfPipe,
        ReCaptchaComponent,
        ClassicModalComponent,
        GraphComponent,
        GraphWhenComponent,
        GraphDefaultComponent,
        GraphEmbeddableDirective,
        FocusAfterViewInitDirective,
        GraphToolbarComponent,
        TestGraphComponent,
        TestGraphInlineComponent,
        CamelCasePipe,
        CapitalCamelCaseSpacedPipe,
        CamelCaseToCapitalPipe,
        AnoSeletorComponent,
        TestInputComponent,
        WizardComponent,
        WizardStepComponent,
        TabPanelComponent,
        TabComponent,
        ToolbarComponent,
        ToolbarLeftSectionComponent,
        ToolbarRightSectionComponent,
        ListToolbarComponent,
        ActionButtonComponent,
        EditToolbarComponent,
        CrudComponent,
        MessagePanelComponent,
        AutocompleteComponent,
        AutocompleteGridComponent,
        ContextBarComponent,
        GridToolbarComponent,
        PopupComponent,
        TestCrudComponent,
        YesNoDropdownComponent,
        HostComponentProvider,
        TestCrudComponent,
        DxiCheckBoxAlignmentDirective,
        DxCheckBoxIndeterminateDirective,
        PropagateElementAttrToInputDirective,
        InputOnlyNumberDirective,
        InputUppercaseDirective,
        SelectBoxEnumBasedComponent,
        CustomTreeListComponent,
        DxDropDownBoxModule,
        DxCheckBoxModule,
        DxButtonModule,
        GridFocusDirective,
        GridRowDoubleClickDirective,
        DxBoxModule,
        DxRadioGroupModule,
        ReportToolbarComponent,
        ReportComponent,
        DxAutoWidthDirective,
        DxAutoHeightDirective,
        DxAutoSizeDirective,
        AutoWidthDirective,
        AutoHeightDirective,
        AutoSizeDirective,
        FormatMoeda,
        PrintComponent,
        MonetaryInputComponent,
        DxSwitchModule,
        ArquivoDigitalComponent,
        DxFileUploaderModule,
        DxProgressBarModule,
        MessageDetailsPopupComponent,
        CkeditorComponent,
        CurrencyPtBRPipe,
        DxTreeListModule,
        DataFieldInfoComponent,
        DateRangeComponent,
        DxContextMenuModule,
        FieldSetComponent,
        TarefaProgressBarComponent,
        InputDateDirective,
        DxTooltipModule,
        RelatorioGrupoComponent,
        RelatorioHostDirective,
        YoutubePopupPlayerComponent,
        YoutubePlayerComponent,
        GoogleDocsComponent,
        SelectBoxEntityBasedComponent,
        ContextBarDirective,
        SelectBoxGridEntityBased,
        SelectBoxTreeGridEntityBased,
        TooltipHelperComponent,
        CepPipe,
        CpfCnpjPipe,
        DockerPullComponent,
        DockerPullLayerComponent,
        UsuarioAutocompleteComponent,
        DxColorBoxModule,
        DxMapModule,
        DxColorBoxModule,
        NotaVersaoComponent,
        DxTabPanelModule,
        DxColorBoxModule,
        SafePipe,
        PdfViewerComponent,
        BaseViewComponent,
        TarefaStatusIndicatorComponent,
        TarefaProgressComponent,
        ArquivoDigitalDownloadButtonComponent,
        PublicidadeComponent,
        GoogleDocsMetadadoComponent,
        FormatNumberPipe,
        PublicidadeComponent,
        PaletteSelectorComponent,
        DxSchedulerModule,
        DxSliderComponent,
        JsonComponent,
        LabelTagComponent,
        AutoSizeContainerComponent,
        TagBoxBasedComponent,
        DxDiagramComponent,
        DxoToolboxComponent,
        DxoToolbarComponent,
        DxoMainToolbarComponent,
        DxoViewToolbarComponent,
        DxoNodesComponent,
        DxoAutoLayoutComponent,
        DxoPropertiesPanelComponent,
        DxoEdgesComponent,
        DxiGroupComponent,
        DxLinearGaugeComponent,
        DxoSubvalueIndicatorComponent,
        DxoValueIndicatorComponent,
        DxoRangeContainerComponent,
        DxiRangeComponent,
        DxoScaleComponent,
        DxoTickComponent,
        ArquivoDigitalPreviewComponent,
        SistemasAutorizadosSeletorComponent
    ],
    declarations: [
        SystemFlagComponent,
        FontAwesomeStyleDirective,
        SimNaoPrintPipe,
        ProgressoPipe,
        GlobalLoadPanelComponent,
        NgIfCallback,
        PopupInnerContentComponent,
        PropagateEventGloballyDirective,
        DxChartWrapper,
        ClassicDynamicModalComponent,
        MesSeletorComponent,
        FirstKeysToConsolePipe,
        JsonfPipe,
        NgForEmphasisOf,
        EventBindDirective,
        ArrayModReducePipe,
        ArrayKeyFilterPipe,
        SubArrayKeyFilterPipe,
        TextoCkeditorPipe,
        ReCaptchaComponent,
        BaseRouteViewComponent,
        ClassicModalComponent,
        GraphComponent,
        GraphWhenComponent,
        GraphDefaultComponent,
        GraphEmbeddableDirective,
        GraphToolbarComponent,
        TestGraphComponent,
        TestGraphInlineComponent,
        CamelCasePipe,
        CapitalCamelCaseSpacedPipe,
        CamelCaseToCapitalPipe,
        AnoSeletorComponent,
        WizardComponent,
        WizardStepComponent,
        TabPanelComponent,
        TabComponent,
        ToolbarComponent,
        CrudComponent,
        ToolbarLeftSectionComponent,
        ToolbarRightSectionComponent,
        ListToolbarComponent,
        ActionButtonComponent,
        EditToolbarComponent,
        MessagePanelComponent,
        AutocompleteComponent,
        AutocompleteGridComponent,
        ContextBarComponent,
        TestCrudComponent,
        TestInputComponent,
        GridToolbarComponent,
        YesNoDropdownComponent,
        PopupComponent,
        HostComponentProvider,
        DxiCheckBoxAlignmentDirective,
        DxCheckBoxIndeterminateDirective,
        PropagateElementAttrToInputDirective,
        FocusAfterViewInitDirective,
        InputOnlyNumberDirective,
        InputUppercaseDirective,
        SelectBoxEnumBasedComponent,
        CustomDataGridComponent,
        CustomTreeListComponent,
        GridFocusDirective,
        GridRowDoubleClickDirective,
        ReportToolbarComponent,
        ReportComponent,
        DxAutoWidthDirective,
        DxAutoHeightDirective,
        DxAutoSizeDirective,
        AutoWidthDirective,
        AutoHeightDirective,
        AutoSizeDirective,
        FormatMoeda,
        PrintComponent,
        MonetaryInputComponent,
        ArquivoDigitalComponent,
        MessageDetailsPopupComponent,
        CkeditorComponent,
        CurrencyPtBRPipe,
        DataFieldInfoComponent,
        DateRangeComponent,
        FieldSetComponent,
        TarefaProgressBarComponent,
        InputDateDirective,
        RelatorioGrupoComponent,
        RelatorioHostDirective,
        YoutubePopupPlayerComponent,
        YoutubePlayerComponent,
        GoogleDocsComponent,
        SelectBoxEntityBasedComponent,
        ContextBarDirective,
        SelectBoxGridEntityBased,
        SelectBoxTreeGridEntityBased,
        TooltipHelperComponent,
        CepPipe,
        CpfCnpjPipe,
        DockerPullComponent,
        DockerPullLayerComponent,
        UsuarioAutocompleteComponent,
        NotaVersaoComponent,
        UsuarioAutocompleteComponent,
        SafePipe,
        PdfViewerComponent,
        BaseViewComponent,
        TarefaStatusIndicatorComponent,
        TarefaProgressComponent,
        ArquivoDigitalDownloadButtonComponent,
        PublicidadeComponent,
        GoogleDocsMetadadoComponent,
        FormatNumberPipe,
        PublicidadeComponent,
        PaletteSelectorComponent,
        JsonComponent,
        LabelTagComponent,
        AutoSizeContainerComponent,
        TagBoxBasedComponent,
        ArquivoDigitalPreviewComponent,
        SistemasAutorizadosSeletorComponent
    ]
})
export class UiModule {
}
