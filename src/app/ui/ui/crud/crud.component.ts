import {
    Component,
    ContentChildren,
    ElementRef,
    Injector,
    Input,
    QueryList,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {AbstractCrud} from "./abstract.crud";
import {Mode} from "./crud.mode";
import {DxDataGridComponent} from "devextreme-angular/ui/data-grid";
import {DomHandler} from '../../app/services/dom.handler';
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {Subscription} from "rxjs";
import {MessageType} from "../classes/message.type";
import {DxFormComponent, DxTreeListComponent} from "devextreme-angular";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import {Message} from "../classes/message";
import validationEngine from "devextreme/ui/validation_engine";
import {AppStateService} from "../../app/services/app.state.service";
import {ContextBarDirective} from "../directives/context.bar.directive";
import * as _ from "lodash";
import {ValidationListener} from "../classes/validation.listener";
import {AutoSizeService} from "../services/auto.size.service";
import {TabPanelService} from "../services/tab.panel.service";


let crudValidationGroupGen: number = 0;

const MARGIN_ROOT_HEIGHT: number = 14;

@Component({
    selector: "crud",
    styleUrls: ['crud.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
        <div *ngIf="toolbarFullOverride" style="display:flex;" class="{{cssClass}}">
            <!-- if no ng-content.select matches, use this as a fallback -->
            <ng-content></ng-content>
        </div>
        <div style="display:flex; flex-direction:column; height: inherit; overflow: hidden" class="{{cssClass}}">
            
            <div #fixedArea style="display:flex; flex-shrink: 0; flex-direction:column;" class="{{cssClass}}">

                <!-- Toolbar list -->
                <div *ngIf="mode === modes.List  && !toolbarFullOverride">
                    <list-toolbar
                            [cssClass]="listToolbarCssClass"
                            [rightSectionCssClass]="listToolbarRightSectionCssClass"
                            [leftSectionCssClass]="listToolbarLeftSectionCssClass"
                            [showLeftSection]="listToolbarShowLeftSection"
                            [showRightSection]="listToolbarShowRightSection"
                            [title]="listToolbarTitle"
                            [titleCssClass]="listToolbarTitleCssClass"
                            [allButtonsCssClass]="listToolbarAllButtonsCssClass"
                            [filterButtonCssClass]="listToolbarFilterButtonCssClass"
                            [newButtonCssClass]="listToolbarNewButtonCssClass"
                            [clearButtonCssClass]="listToolbarClearButtonCssClass"
                            [closeButtonCssClass]="listToolbarCloseButtonCssClass"
                            [filterButtonIconClass]="listToolbarFilterButtonIconClass"
                            [filterButtonText]="listToolbarFilterButtonText"
                            [filterButtonOrder]="listToolbarFilterButtonOrder"
                            [filterButtonShow]="listToolbarFilterButtonShow"
                            [filterButtonTitle]="listToolbarFilterButtonTitle"
                            [filterButtonDisabled]="listToolbarFilterButtonDisabled"
                            [newButtonIconClass]="listToolbarNewButtonIconClass"
                            [newButtonText]="listToolbarNewButtonText"
                            [newButtonOrder]="listToolbarNewButtonOrder"
                            [newButtonShow]="listToolbarNewButtonShow"
                            [newButtonTitle]="listToolbarNewButtonTitle"
                            [newButtonDisabled]="listToolbarNewButtonDisabled"
                            [clearButtonIconClass]="listToolbarClearButtonIconClass"
                            [clearButtonText]="listToolbarClearButtonText"
                            [clearButtonOrder]="listToolbarClearButtonOrder"
                            [clearButtonShow]="listToolbarClearButtonShow"
                            [clearButtonTitle]="listToolbarClearButtonTitle"
                            [clearButtonDisabled]="listToolbarClearButtonDisabled"
                            [closeButtonIconClass]="listToolbarCloseButtonIconClass"
                            [closeButtonText]="listToolbarCloseButtonText"
                            [closeButtonOrder]="listToolbarCloseButtonOrder"
                            [closeButtonShow]="!embedded && listToolbarCloseButtonShow"
                            [closeButtonTitle]="listToolbarCloseButtonTitle"
                            [closeButtonDisabled]="listToolbarCloseButtonDisabled"
                            (filterButtonAction)="onListToolbarFilterButtonAction($event)"
                            (newButtonAction)="onListToolbarNewButtonAction($event)"
                            (clearButtonAction)="onListToolbarClearButtonAction($event)"
                            (closeButtonAction)="onListToolbarCloseButtonAction($event)">

                        <ng-content select="[crud-list-toolbar-override]"></ng-content>

                    </list-toolbar>
                </div>

                <!-- Toolbar edit -->
                <div *ngIf="!embedded && mode === modes.Edit && !toolbarFullOverride">
                    <edit-toolbar
                            [cssClass]="editToolbarCssClass"
                            [rightSectionCssClass]="editToolbarRightSectionCssClass"
                            [leftSectionCssClass]="editToolbarLeftSectionCssClass"
                            [showLeftSection]="editToolbarShowLeftSection"
                            [showRightSection]="editToolbarShowRightSection"
                            [title]="editToolbarTitle"
                            [titleCssClass]="editToolbarTitleCssClass"
                            [allButtonsCssClass]="editToolbarAllButtonsCssClass"
                            [saveCloseButtonCssClass]="editToolbarSaveCloseButtonCssClass"
                            [saveButtonCssClass]="editToolbarSaveButtonCssClass"
                            [cancelButtonCssClass]="editToolbarCancelButtonCssClass"
                            [deleteButtonCssClass]="editToolbarDeleteButtonCssClass"
                            [newButtonCssClass]="editToolbarNewButtonCssClass"
                            [closeButtonCssClass]="editToolbarCloseButtonCssClass"
                            [saveCloseButtonIconClass]="editToolbarSaveCloseButtonIconClass"
                            [saveCloseButtonText]="editToolbarSaveCloseButtonText"
                            [saveCloseButtonOrder]="editToolbarSaveCloseButtonOrder"
                            [saveCloseButtonShow]="editToolbarSaveCloseButtonShow"
                            [saveCloseButtonTitle]="editToolbarSaveCloseButtonTitle"
                            [saveButtonIconClass]="editToolbarSaveButtonIconClass"
                            [saveButtonText]="editToolbarSaveButtonText"
                            [saveButtonOrder]="editToolbarSaveButtonOrder"
                            [saveButtonShow]="editToolbarSaveButtonShow"
                            [saveButtonTitle]="editToolbarSaveButtonTitle"
                            [cancelButtonIconClass]="editToolbarCancelButtonIconClass"
                            [cancelButtonText]="editToolbarCancelButtonText"
                            [cancelButtonOrder]="editToolbarCancelButtonOrder"
                            [cancelButtonShow]="editToolbarCancelButtonShow"
                            [cancelButtonTitle]="editToolbarCancelButtonTitle"
                            [deleteButtonIconClass]="editToolbarDeleteButtonIconClass"
                            [deleteButtonText]="editToolbarDeleteButtonText"
                            [deleteButtonOrder]="editToolbarDeleteButtonOrder"
                            [deleteButtonShow]="editToolbarDeleteButtonShow"
                            [deleteButtonTitle]="editToolbarDeleteButtonTitle"
                            [newButtonIconClass]="editToolbarNewButtonIconClass"
                            [newButtonText]="editToolbarNewButtonText"
                            [newButtonOrder]="editToolbarNewButtonOrder"
                            [newButtonShow]="editToolbarNewButtonShow"
                            [newButtonTitle]="editToolbarNewButtonTitle"
                            [closeButtonIconClass]="editToolbarCloseButtonIconClass"
                            [closeButtonText]="editToolbarCloseButtonText"
                            [closeButtonOrder]="editToolbarCloseButtonOrder"
                            [closeButtonShow]="editToolbarCloseButtonShow"
                            [closeButtonTitle]="editToolbarCloseButtonTitle"
                            (saveCloseButtonAction)="onEditToolbarSaveCloseButtonAction($event)"
                            (saveButtonAction)="onEditToolbarSaveButtonAction($event)"
                            (deleteButtonAction)="onEditToolbarDeleteButtonAction($event)"
                            (cancelButtonAction)="onEditToolbarCancelButtonAction($event)"
                            (newButtonAction)="onEditToolbarNewButtonAction($event)"
                            (closeButtonAction)="onEditToolbarCloseButtonAction($event)">

                        <ng-content select="[crud-edit-toolbar-override]"></ng-content>

                    </edit-toolbar>
                </div>

                <!-- messages -->
                <message-panel *ngIf="parent" [visible]="parent?.errorsVisible" [messageType]="messageType"
                               (visibleChange)="onCloseButtonMessagePanel($event)"
                               [messages]="parent?.errorMessages"></message-panel>

                <!-- form header -->
                <div>
                    <ng-content select="[crud-header]"></ng-content>
                </div>


                <!-- list filters w/ accordion -->
                <ng-container *ngIf="mode == modes.List && !collapsibleFilters">
                    <div style="flex-shrink: 0">
                        <ng-container *ngTemplateOutlet="crudListTemplate"></ng-container>
                    </div>
                </ng-container>

                <!-- list filters -->
                <div *ngIf="mode === modes.List && collapsibleFilters" style="flex-shrink: 0; min-height: 30px">
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
                            <ng-container *ngTemplateOutlet="crudListTemplate"></ng-container>
                        </div>

                    </dx-accordion>
                </div>

                <ng-template #crudListTemplate>
                    <ng-content select="[crud-list-filter-fields]"></ng-content>
                </ng-template>

                <div style="position: absolute; left: -1000px; top: -1000px">
                    <input #hiddenInput type="text" style="visibility: hidden">
                </div>
            </div>

            <!-- content -->

            <div *ngIf="mode === modes.List"
                 style="flex-shrink: 1; flex-grow: 1; border-top: 1px solid #cfcfcf; overflow: auto">
                <auto-size-container [minHeight]="300" (heightChange)="updateListGridHeight($event)">
                    <ng-content select="[crud-list-grid]"></ng-content>
                </auto-size-container>
            </div>

            <!-- edit area -->
            <div *ngIf="mode === modes.Edit">
                <ng-content select="[crud-edit-contextbar]"></ng-content>
            </div>

            <div *ngIf="mode === modes.Edit" style="flex-shrink: 1; flex-grow: 1; overflow: auto">
                <ng-content select="[crud-edit-template]"></ng-content>
            </div>
        </div>

    `,
    providers:[AutoSizeService, TabPanelService]
})
export class CrudComponent<T, F> {

    doOnDestroy(): void {
        if (this.rowClickSubscription) {
            this.rowClickSubscription.unsubscribe();
        }

        if (this.onDataSourceRefreshRequestSubscription) {
            this.onDataSourceRefreshRequestSubscription.unsubscribe();
        }

        if (this.windowResizeSubscription) {
            this.windowResizeSubscription.unsubscribe();
        }

        if (this.toolbarExpandedSubscription) {
            this.toolbarExpandedSubscription.unsubscribe();
        }
    }

    constructor(private domHandler: DomHandler,
                private utils: ObjectUtilsService,
                private appStateService: AppStateService,
                private messageBoxUiService: MessageBoxUiService,
                private autoSizeService: AutoSizeService,
                private injector: Injector,
                private rootElementRef: ElementRef) {
        this._validationGroupId = `crudValidationGroup${crudValidationGroupGen}`;
        crudValidationGroupGen = crudValidationGroupGen + 1;
        autoSizeService.marginRootHeight = MARGIN_ROOT_HEIGHT;
    }

    parent: AbstractCrud<T, F>;

    setParent(instance) {
        this.parent = instance;
    }

    /*
     * *IMPORTANTE* - iremos propagar os bindings dos componentes internos para 'fora' apenas pelo fato dos componentes serem nosso
     * e também não ser tantos atributos.
     *
     * Não iremos propagar bindings de componentes devextreme. No caso de componentes devextreme, devemos utilizar transclusion.
     */

    /**
     * general
     */
    @Input() cssClass;

    @Input() mode: Mode = Mode.List;

    @Input() collapsibleFilters = true; // By default all filters are collapsible
    filterAccordion = ['filter'];
    accordionFilterTitle = "Ocultar Filtros";
    collapsibleState = this.filterAccordion[0];

    @Input() deleteConfirmMessage = "Deseja realmente excluir?";

    @Input() deleteConfirmTitle: string;

    @Input() useDeleteConfirmation = true;

    @Input() embedded = false;

    @Input() multipleSelection = false;

    @Input() mustSetGridRowClick = true;

    @Input() mustSetGridDynamicEventBindings = true;

    @Input() listRowDbClickHandler: (data: T | T[]) => void;

    @Input() filterOnFocused = false;

    @Input() filterOnInit: boolean = false;

    @Input() infiniteGridMode: boolean = true;

    modes: any = Mode;

    @ViewChild("fixedArea", { static: true }) fixedArea: ElementRef;

    @ViewChild("hiddenInput") hiddenInput: ElementRef<HTMLInputElement>;

    @ContentChildren(DxDataGridComponent, {descendants: true}) grids: QueryList<DxDataGridComponent>;
    @ContentChildren(DxTreeListComponent) treeGrids: QueryList<DxTreeListComponent>;
    @ContentChildren(DxFormComponent) forms: QueryList<DxFormComponent>;
    @ContentChildren(ContextBarDirective) contextBarProviders: QueryList<ContextBarDirective>;

    active: boolean = false;

    get selectedItem(): any {
        let grid = this.getMainListGrid();

        let selection = grid.instance.getSelectedRowsData();

        if (!selection || selection.length == 0) {
            return null;
        }

        if (this.multipleSelection) {
            return selection;
        } else {
            return selection[0];
        }
    }

    hasHeightGridPrincipal: boolean = false;

    messageType: MessageType = "ERROR";

    private listGrid: DxDataGridComponent | DxTreeListComponent;

    private rowClickSubscription: Subscription;

    private onDataSourceRefreshRequestSubscription: Subscription;

    private windowResizeSubscription: Subscription;

    private toolbarExpandedSubscription: Subscription;

    private editModelErrorMap = new Map<string, string>();

    private listGridConfigured: boolean = false;

    private subValidators: Map<string, ValidationListener> = new Map<string, ValidationListener>();

    private _validationGroupId: string;
    get validationGroupId(): string {
        return this._validationGroupId;
    }
    set validationGroupId(value: string) {
        this._validationGroupId = value;
    }

    @Input()
    onlyEditMode: boolean = false;

    addSubValidator(validationGroup: string, listener: ValidationListener): void {
        this.subValidators.set(validationGroup, listener);
    }

    removeSubValidator(validationGroup: string): void {
        this.subValidators.delete(validationGroup);
    }

    refreshGrid() {
        const grid = this.getMainListGrid();
        if (grid) {
            grid.instance.refresh();
        }
    }

    resize() {
        this.autoSizeService.resize();
        this.parent.calcContentSize();
    }

    setMarginRootHeight(marginRootHeight: number) {
        this.autoSizeService.marginRootHeight = marginRootHeight;
    }

    doAfterViewInit(): void {

        const grid = this.getMainListGrid();

        if (grid) {
            this.rowClickSubscription = grid.onRowClick.subscribe(e => {
                this.setGridRowClick(e);
            });
            this.configureGrid();
            this.setGridDynamicEventBindings();
            this.resize();
        }

        //ajusta padding do formulario na area de filtros
        const element = this.domHandler.jQuery('[crud-list-filter-fields]').children();
        if (element) {
            element.css("padding-top", "4px");
        }

        /* Ajusta List Grid */
        if (!this.embedded) {
            this.windowResizeSubscription = this.appStateService.resizedWindow.subscribe(context => {
                if (context) {
                    if (this.active && !this.embedded) {
                        this.resize();
                    }
                }
            });
            this.toolbarExpandedSubscription = this.appStateService.toolbarExpanded.subscribe(() => {
                if (this.active && !this.embedded) {
                    this.resize();
                }
            });
        }

        this.prepareDeleteConfirmTitle();
    }

    setMustSetGridRowClick(mustSetGridRowClick: boolean) {
        this.mustSetGridRowClick = mustSetGridRowClick;
    }

    setGridRowClick(e) {
        if (this.mustSetGridRowClick) {
            const rows = this.domHandler.jQueryWithContext("tr.dx-data-row", this.domHandler.jQuery(e.element));
            if (rows) {
                let alt = false;
                const targetCssClass = "custom-dx-datagrid-row-clicked";
                for (let i = 0; i < rows.length; i++) {
                    const rawRow = rows[i];
                    const row = this.domHandler.jQuery(rawRow);

                    if (
                        row.hasClass("dx-state-invisible") ||
                        row.hasClass("dx-freespace-row") ||
                        row.hasClass("dx-header-row")
                    ) {
                        continue;
                    }

                    if (alt) {
                        row.addClass("dx-row-alt");
                    } else {
                        row.removeClass("dx-row-alt");
                    }
                    alt = !alt;

                    if (rawRow == e.rowElement) {
                        row.addClass(targetCssClass).removeClass("dx-row-alt");
                    } else {
                        row.removeClass(targetCssClass);
                    }
                }
            }
        }
    }

    closeMessage() {
        this.parent.errorsVisible = false;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('closeMessage');
        });
    }

    showErrorMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "ERROR";
        this.parent.errorObjects = message;
        this.parent.errorsVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showErrorMessage');
        });
    }

    showSuccessMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "SUCCESS";
        this.parent.errorObjects = message;
        this.parent.errorsVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showSuccessMessage');
        });
    }

    showInfoMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "INFO";
        this.parent.errorObjects = message;
        this.parent.errorsVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showInfoMessage');
        });
    }

    showWarningMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "WARNING";
        this.parent.errorObjects = message;
        this.parent.errorsVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showWarningMessage');
        });
    }

    hideMessages(): void {
        this.messageType = null;
        this.parent.errorMessages = null;
        this.parent.errorsVisible = false;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('hideMessages');
        });
    }

    handleError(error: ExceptionInfo): void {

        this.showErrorMessage(this.parent.exceptionInfoService.toMessages(error, this.editModelErrorMap));

        this.validateEditForm();

    }

    getEditModelError(attribute: string): string {
        return this.editModelErrorMap.get(attribute);
    }

    /*
     * Manter este método comentado pois viabiliza o comportamento de alterar
     * para edit mode sem usar rota. Por hora, será usado rota. Caso a estratégia mude (volte a mudar
     * apenas o estado interno), descomentar este método.
     **/

    /*
     private onEditMode(data: any, self: CrudComponent<T, F>) {
       self.setMode(Mode.Edit);
       self.parent.onEditMode(data);
     }
     */

    getMainListGrid(): DxDataGridComponent | DxTreeListComponent {
        if (!this.listGrid) {

            if (this.grids.length == 1) {
                if (!this.grids.first.elementAttr['grid-except']) {
                    this.listGrid = this.grids.first;
                }
                return this.listGrid;
            }

            if (this.treeGrids.length == 1) {
                if (!this.treeGrids.first.elementAttr['grid-except']) {
                    this.listGrid = this.treeGrids.first;
                }
                return this.listGrid;
            }

            this.grids.forEach((grid: DxDataGridComponent | DxTreeListComponent) => {
                const isPrincipal = grid.elementAttr && grid.elementAttr['principal'];
                if (this.utils.toBoolean(isPrincipal)) {
                    this.listGrid = grid;
                    return grid;
                }
            })
        }

        return this.listGrid;
    }

    private onEditMode(data: any, self: CrudComponent<T, F>) {
        self.parent.onEditMode(data);
    }

    private setGridDynamicEventBindings() {
        if (this.mustSetGridDynamicEventBindings) {
            const grid = this.getMainListGrid();

            const editHandler = this.onEditMode;
            const customDbClickHandler = this.listRowDbClickHandler;
            const multipleSelection = this.multipleSelection;
            const self = this;
            const $ = this.domHandler.jQuery();

            grid.onCellPrepared.subscribe(e => {
                $(e.cellElement)
                    .find(".crud-dynamic-edit-column")
                    .each(function () {
                        $(this).click(function () {
                            editHandler(e.data, self);
                        });
                    });
            });

            grid.onRowPrepared.subscribe(row => {
                if (row.rowType != "header") {
                    $(row.rowElement).dblclick(function (e) {
                        if (customDbClickHandler) {
                            customDbClickHandler(multipleSelection ? [row.data] : row.data);
                        } else {
                            editHandler(row.data, self);
                        }
                    });
                }
            });
        }
    }

    private configureGrid() {
        this.listGridConfigured = true;

        const grid = this.getMainListGrid();

        if (grid.height) {
            this.hasHeightGridPrincipal = true;
        }

        grid.rowAlternationEnabled = true;
        grid.hoverStateEnabled = true;
        grid.paging = {enabled: false};

        if (this.infiniteGridMode) {
            grid.loadPanel.enabled = false;
            grid.scrolling.mode = 'infinite';
        }

        if (this.embedded) {
            if (this.treeGrids && this.treeGrids.length > 0) {
                grid.selection = {
                    mode: this.multipleSelection ? "multiple" : "single", showCheckBoxesMode: "none"
                };
            } else if (this.grids && this.grids.length > 0) {
                grid.selection = {
                    mode: this.multipleSelection ? "multiple" : "single", showCheckBoxesMode: "always"
                };
            }
        } else {
            if (this.mustSetGridDynamicEventBindings) {
                const columns: Array<any> = grid.columns;

                const editColumn = {
                    alignment: "right",
                    cellTemplate: "<i title='Editar' class='fal fa-pen-square crud-dynamic-edit-column'></i>",
                    width: "30",
                };

                if (columns) {
                    columns.unshift(editColumn);
                }
            }
        }

        /*
         * obrigatoriamente desabilitar cache
         */
        grid.cacheEnabled = false;

        this.autoSizeService.resize();
    }

    /**
     * List toolbar
     */

    @Input() toolbarFullOverride: boolean = false;

    @Input() listToolbarCssClass: string = "crud-toolbar";

    @Input() listToolbarRightSectionCssClass: string = "crud-toolbar-right-section";

    @Input() listToolbarLeftSectionCssClass: string;

    @Input() listToolbarShowLeftSection: boolean = true;

    @Input() listToolbarShowRightSection: boolean = true;

    @Input() listToolbarTitle;

    @Input() listToolbarTitleCssClass;

    @Input() listToolbarAllButtonsCssClass = "crud-toolbar-buttons";

    /**
     * right section buttons
     */
    @Input() listToolbarFilterButtonCssClass;
    @Input() listToolbarNewButtonCssClass;
    @Input() listToolbarClearButtonCssClass;
    @Input() listToolbarCloseButtonCssClass;

    /**
     * filter button
     */
    @Input() listToolbarFilterButtonIconClass = "fa fa-search";
    @Input() listToolbarFilterButtonText = "Filtrar";
    @Input() listToolbarFilterButtonOrder = 0;
    @Input() listToolbarFilterButtonShow = true;
    @Input() listToolbarFilterButtonTitle = "Filtrar";
    @Input() listToolbarFilterButtonDisabled = false;

    /**
     * new button
     */
    @Input() listToolbarNewButtonIconClass = "fa fa-plus-square";
    @Input() listToolbarNewButtonText = "Novo";
    @Input() listToolbarNewButtonOrder = 1;
    @Input() listToolbarNewButtonShow = true;
    @Input() listToolbarNewButtonTitle = "Novo";
    @Input() listToolbarNewButtonDisabled = false;

    /**
     * clear button
     */
    @Input() listToolbarClearButtonIconClass = "fa fa-eraser";
    @Input() listToolbarClearButtonText = "Limpar";
    @Input() listToolbarClearButtonOrder = 2;
    @Input() listToolbarClearButtonShow = true;
    @Input() listToolbarClearButtonTitle = "Limpar";
    @Input() listToolbarClearButtonDisabled = false;


    /**
     * close button
     */
    @Input() listToolbarCloseButtonIconClass = "fa fa-times-circle";
    @Input() listToolbarCloseButtonText = "Fechar";
    @Input() listToolbarCloseButtonOrder = 3;
    @Input() listToolbarCloseButtonShow = true;
    @Input() listToolbarCloseButtonTitle = "Fechar";
    @Input() listToolbarCloseButtonDisabled = false;

    prepareDeleteConfirmTitle() {
        if (this.utils.isEmpty(this.deleteConfirmTitle)) {
            this.deleteConfirmTitle = this.editToolbarTitle;
        }
    }

    /**
     * list toolbar listeners
     */

    onListToolbarFilterButtonAction(event) {
        this.parent.execFilter();
    }

    onListToolbarNewButtonAction(event) {
        this.parent.doCreateNew(this.mode);
    }

    onListToolbarClearButtonAction(event) {
        this.parent.doClear(this.mode);

        //invokes 'doClear' method of the context bars
        if (this.contextBarProviders) {
            this.contextBarProviders.forEach(provider => {
                const contextbar = provider.hostComponent;
                if (contextbar && typeof contextbar['doClear'] === "function") {
                    contextbar.doClear();
                }
            });
        }
    }

    onListToolbarCloseButtonAction(event) {
        this.parent.doClose(this.mode);
    }

    onCloseButtonMessagePanel(valor) {
        if (this.parent.errorsVisible != valor) {
            setTimeout(() => {
                this.appStateService.resizedWindow.next('onCloseButtonMessagePanel');
            });
        }
        this.parent.errorsVisible = valor;
    }

    selectedItemChange(value) {
        setTimeout(() => this.autoSizeService.resize(), 300);
        if (_.isNil(value)) {
            this.accordionFilterTitle = "Exibir Filtros";
        } else {
            this.accordionFilterTitle = "Ocultar Filtros";
        }
    }

    /**
     * edit toolbar
     */
    @Input() editToolbarCssClass: string = "crud-toolbar";

    @Input() editToolbarRightSectionCssClass: string = "crud-toolbar-right-section";

    @Input() editToolbarLeftSectionCssClass: string;

    @Input() editToolbarShowLeftSection: boolean = true;

    @Input() editToolbarShowRightSection: boolean = true;

    @Input() editToolbarTitle;

    @Input() editToolbarTitleCssClass;

    @Input() editToolbarAllButtonsCssClass = "crud-toolbar-buttons";

    /**
     *  edit toolbar right section buttons
     */
    @Input() editToolbarSaveCloseButtonCssClass;

    @Input() editToolbarSaveButtonCssClass;

    @Input() editToolbarCancelButtonCssClass;

    @Input() editToolbarDeleteButtonCssClass;

    @Input() editToolbarNewButtonCssClass;

    @Input() editToolbarCloseButtonCssClass;

    /**
     *  edit toolbar save/close button
     */
    @Input() editToolbarSaveCloseButtonIconClass = "fa fa-save";
    @Input() editToolbarSaveCloseButtonText = "Salvar/Fechar";
    @Input() editToolbarSaveCloseButtonOrder = 0;
    @Input() editToolbarSaveCloseButtonShow = true;
    @Input() editToolbarSaveCloseButtonTitle = "Salvar/Fechar";

    /**
     *  edit toolbar save button
     */
    @Input() editToolbarSaveButtonIconClass = "fa fa-file";
    @Input() editToolbarSaveButtonText = "Salvar";
    @Input() editToolbarSaveButtonOrder = 1;
    @Input() editToolbarSaveButtonShow = true;
    @Input() editToolbarSaveButtonTitle = "Salvar";

    /**
     *  edit toolbar cancel button
     */
    @Input() editToolbarCancelButtonIconClass = "fa fa-ban";
    @Input() editToolbarCancelButtonText = "Cancelar";
    @Input() editToolbarCancelButtonOrder = 2;
    @Input() editToolbarCancelButtonShow = true;
    @Input() editToolbarCancelButtonTitle = "Cancelar";

    /**
     *  edit toolbar delete button
     */
    @Input() editToolbarDeleteButtonIconClass = "fa fa-trash";
    @Input() editToolbarDeleteButtonText = "Excluir";
    @Input() editToolbarDeleteButtonOrder = 3;
    @Input() editToolbarDeleteButtonShow = true;
    @Input() editToolbarDeleteButtonTitle = "Excluir";

    /**
     *  edit toolbar new button
     */
    @Input() editToolbarNewButtonIconClass = "fa fa-plus-square";
    @Input() editToolbarNewButtonText = "Novo";
    @Input() editToolbarNewButtonOrder = 4;
    @Input() editToolbarNewButtonShow = true;
    @Input() editToolbarNewButtonTitle = "Novo";

    /**
     *  edit toolbar close button
     */
    @Input() editToolbarCloseButtonIconClass = "fa fa-times-circle";
    @Input() editToolbarCloseButtonText = "Fechar";
    @Input() editToolbarCloseButtonOrder = 5;
    @Input() editToolbarCloseButtonShow = true;
    @Input() editToolbarCloseButtonTitle = "Fechar";

    setDeleteConfirmMessage(msg) {
        this.deleteConfirmMessage = msg;
    }

    setMode(mode: Mode) {
        this.mode = mode;
    }

    getMode() {
        return this.mode;
    }

    getModes() {
        return this.modes;
    }

    getFixedArea() {
        return this.fixedArea;
    }

    resetMode() {
        this.setMode(Mode.List);
    }

    getEditForms(): DxFormComponent[] {

        return this.forms.filter(form => {

            return this.domHandler.jQuery(form.instance.element())
                .parents('[crud-edit-template]')
                .length > 0;

        });

    }

    clearValidation(): void {
        this.closeMessage();
        this.editModelErrorMap = new Map<string, string>();
    }

    validateEditForm(): boolean {

        let customFieldsValidation = null;

        try {
            customFieldsValidation = validationEngine.validateGroup(this.validationGroupId);
        } catch (e) {
            console.log("ValidationGroup nao criado: " + this.validationGroupId);
        }

        let response = !customFieldsValidation || customFieldsValidation.isValid;

        this.subValidators.forEach((listener, validationGroup) => {

            try {
                customFieldsValidation = validationEngine.validateGroup(validationGroup);
            } catch (e) {
                console.log("ValidationGroup nao criado: " + validationGroup);
            }

            if (customFieldsValidation && !customFieldsValidation.isValid) {
                response = false;
                listener.onValidationExecuted(false);
            } else {
                listener.onValidationExecuted(true);
            }

        });

        return response;
    }

    onEditToolbarSaveCloseButtonAction(event) {
        this.clearValidation();

        if (this.validateEditForm()) {
            this.parent.doSave(true);
        } else {
            this.showErrorMessage("Foram encontrados erros na validação do formulário.");
        }
    }

    onEditToolbarSaveButtonAction(event) {

        this.hiddenInput.nativeElement.focus();

        setTimeout(() => {

            this.clearValidation();

            if (this.validateEditForm()) {
                this.parent.doSave(false);
            } else {
                this.showErrorMessage("Foram encontrados erros na validação do formulário.");
            }

        });
    }

    onEditToolbarDeleteButtonAction(event) {
        if (this.useDeleteConfirmation) {
            this.messageBoxUiService.confirm(this.deleteConfirmMessage, this.deleteConfirmTitle).then(yes => {
                if (yes) {
                    this.parent.doRemove();
                }
            });
        } else {
            this.parent.doRemove();
        }
    }

    onEditToolbarCancelButtonAction(event) {
        this.parent.doCancel();
        this.clearValidation();
    }

    onEditToolbarNewButtonAction(event) {
        this.parent.doCreateNew(this.getMode());
        // TODO Comentado pois gera erro ao sair do edit para o novo, limpa o formulário.
        // setTimeout( () => {
        //     this.parent.resetValidators();
        // })
    }

    onEditToolbarCloseButtonAction(event) {
        this.parent.doClose(this.getMode());
    }


    /**
     *  Controla exibição de filtros
     */
    isCollapsibleFilters() {
        return this.collapsibleFilters;
    }

    getCollapsibleState() {
        return this.collapsibleState;
    }

    ocultarFiltros() {
        this.collapsibleState = undefined;
    }

    exibirFiltros() {
        this.collapsibleState = this.filterAccordion[0];
    }

    updateListGridHeight(height: number) {
        this.getMainListGrid().height = height;
    }
}
