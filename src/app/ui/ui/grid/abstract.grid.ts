import {BaseComponent} from "../base-component/base.component";
import {ContentChild, Directive, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {Subject, Subscription} from "rxjs";
import {CustomDataGridEditingState} from "../classes/custom.data.grid.editing.state";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import * as _ from "lodash";
import {jacksonMetadata, JacksonService} from "@sonner/jackson-service-v2";
import {DevExtremeValidatorHelper} from "../classes/dev.extreme.validator.helper";
import {DevExtremeUtils} from "../classes/dev.extreme.utils";
import {CustomDataGridValidationState} from "../classes/custom.data.grid.validation.state";
import {PopupComponent} from "../popup/popup.component";
import * as $ from "jquery";
import {DomHandler} from "../../app/services/dom.handler";
import {DxButtonComponent} from "devextreme-angular";
import {AppStateService} from "../../app/services/app.state.service";
import CheckBox from "devextreme/ui/check_box";
import {confirm} from 'devextreme/ui/dialog';
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {AdjustHeight} from "../directives/adjust.height";
import {debounceTime} from "rxjs/operators";
import DataSource from "devextreme/data/data_source";

let gridGroupSequence = 0;
const CONFIRMATION_MESSAGE = "Tem certeza que pretende eliminar este registro?";

/* Classe base para gestao de components grid (custom-data-grid / custom-tree-list) */
@Directive()
export abstract class AbstractGrid extends BaseComponent implements AdjustHeight {

    @ContentChild(PopupComponent)
    innerPopup: PopupComponent;

    @ViewChild("addButton", { static: true })
    addButton: DxButtonComponent;

    @ViewChild("removeButton", { static: true })
    removeButton: DxButtonComponent;

    removekeyExpr: boolean = true;

    //grid Component
    grid: any;

    appState: AppStateService;
    currentValidationState: CustomDataGridValidationState;
    domHandler: DomHandler;
    messageService: MessageBoxUiService;
    jacksonService: JacksonService;
    currentRowSelected: any;

    /******************************************* COMMON INPUTS *******************************************************/

    @Input()
    gridTitle: string;

    @Input()
    hasCustomPagingConf: boolean = false;

    @Input()
    hasCustomSelectionConf: boolean = false;

    @Input()
    showButtonAddNewRow: boolean = true;

    @Input()
    iconButtonAddNewRow: string = "fa fa-plus";

    @Input()
    enableLoadPanel: boolean = false;

    @Input()
    visible: boolean = true;

    @Input()
    hintAddRow: string = "Incluir registro";

    @Input()
    hintRemoveRow: string = "Excluir registro";

    @Input()
    showButtonRemoveSelectedRows: boolean = true;

    @Input()
    iconButtonRemoveSelectedRows: string = "fa fa-minus";

    @Input()
    disableButtonAddNewRow: boolean = false;

    @Input()
    disableButtonRemoveSelectedRows: boolean = false;

    @Input()
    validateRemoveSelectedRows: Function;

    @Input()
    validateAddNewRow: Function | boolean = () => true;

    _width: number;

    @Input()
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        if (value) {
            this._calcWidth = value;
        }
    }

    _height: number;

    @Input()
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        if (value) {
            this.adjustHeight(value);
        }
    }

    _calcWidth: number;

    _calcHeight: number;

    @Input()
    marginWidth: number = 0;

    @Input()
    marginHeight: number = 0;

    @Input()
    widthToolbar: number;

    @Input()
    heightToolbar: number = 40;

    @Input()
    validationGroup: string = `gridPopupValidationGroup${gridGroupSequence++}`;

    @Input()
    showGridToolBar: boolean = true;

    @Input()
    reorder: boolean = false;

    @Input()
    reorderProperty: string = 'sequencial'; //default column name is 'sequencial'

    @Input()
    allowAdding: boolean = true;

    @Input()
    allowDeleting: boolean = true;

    @Input()
    allowUpdating: boolean = true;

    /******************************************* COMMON OUTPUT *******************************************************/
    @Output()
    onRowMoved: EventEmitter<RowMoved> = new EventEmitter<RowMoved>();

    /******************************************* FUNCTIONS *******************************************************/
    onAfterRowValidated: Function;

    /**
     * Use Promise para realizar validações asyncronas.
     */
    @Input()
    onRowValidating: (state: CustomDataGridValidationState) => boolean | Promise<boolean>;

    @Input()
    onRowClick: Function;

    @Input()
    onRowCollapsed: Function;

    @Input()
    onRowCollapsing: Function;

    @Input()
    onRowExpanded: Function;

    @Input()
    onRowExpanding: Function;

    @Input()
    onRowInserted: Function;

    @Input()
    onRowInserting: Function;

    @Input()
    onRowPrepared: Function;

    @Input()
    disableEditRow: Function;

    @Input()
    onRowRemoved: Function;

    @Input()
    onRowRemoving: Function;

    @Input()
    onRowUpdated: Function;

    @Input()
    onRowUpdating: Function;

    @Input()
    onEditingStart: Function;

    @Input()
    onInitNewRow: Function;

    @Input()
    onSelectionChanged: Function;

    @Input()
    onContentReady: Function;

    @Input()
    onCellPrepared: Function;

    @Input()
    popupFullScreen: boolean = false;

    @Input()
    mapCompare: string | string[];

    @Input()
    itemType: Function; // Tipo de objeto da grid

    @Input()
    preserveFieldsItemType: string[]; // Array das propriedades que serão preservadas após changeItemType

    @Input()
    subItemTypes: Function[]; // Subtipos do objeto da grid

    @Input()
    subItemTypeDefault: Function; // Subtipo padrão para novas instâncias

    @Input()
    onAddNewRow: Function; //sobrescreve a ação do botão de adição de registro

    @Input()
    onRemoveRow: Function; //sobrescreve a ação do botão de remoção de registros

    /**
     *
     * Associa o grid corrente a um grid pai (entidade mestre).
     */
    @Input()
    parentDataGrid: AbstractGrid;

    /**
     *
     * Caso o atributo 'parentDataGrid' seja informado,
     * associa o grid corrente a um field da entidade mestre
     */
    @Input()
    parentEditTemplateData: any;

    @Input()
    parentDataField: string;

    @Input()
    contextData: any;

    /**
     * se 'true', será criado o datafield 'self', que pode ser
     * usado para referenciar o próprio registro
     *
     * Esta flag é útil para grids que possuem um único editCellTemplate
     * para o registro, ao invés de um editCellTemplate para cada atributo
     */
    @Input()
    selfReference: boolean = false;

    gridsFilhos: Map<string, AbstractGrid> = new Map();

    /******************************************* SUBSCRIPTIONS *******************************************************/

    onRowValidationSubscription: Subscription;
    onRowClickSubscription: Subscription;
    onRowCollapsedSubscription: Subscription;
    onRowCollapsingSubscription: Subscription;
    onRowExpandedSubscription: Subscription;
    onRowExpandingSubscription: Subscription;
    onRowInsertedSubscription: Subscription;
    onRowInsertingSubscription: Subscription;
    onRowPreparedSubscription: Subscription;
    onRowRemovedSubscription: Subscription;
    onRowRemovingSubscription: Subscription;
    onRowUpdatedSubscription: Subscription;
    onRowUpdatingSubscription: Subscription;
    onEditingStartSubscription: Subscription;
    onEditingCanceledSubscription: Subscription;
    onInitNewRowSubscription: Subscription;
    onSelectionChangedSubscription: Subscription;
    onContentReadySubscription: Subscription;
    onCellPreparedSubscription: Subscription;
    windowResizeSubscription: Subscription;
    dataSourceChangeSubscription: Subscription;
    popupOnAceitarClickedSubscription: Subscription;
    popupOnFecharClikedSubscription: Subscription;


    currentUpdating: any;
    dataSource: any[];
    dxPopupHeight: number;
    dxPopupWidth: number;


    private editingItem: any;
    private editingItemState: CustomDataGridEditingState;
    private eventData: any;
    private isNewRecord: boolean = false;
    private editingRowIndex: number;
    private errorThrown: boolean = false;
    private disabledEditRows = [];

    private extraEditData: Map<string, any> = new Map();

    private gridEditingMode: Subject<boolean> = new Subject<boolean>();

    constructor(injector: Injector,
                private objUtil = injector.get(ObjectUtilsService)) {
        super(injector);
        this.appState = injector.get(AppStateService);
        this.messageService = injector.get(MessageBoxUiService);
        this.jacksonService = injector.get(JacksonService);
        this.domHandler = injector.get(DomHandler);

        this.installEditingModeHandler();
    }

    private installEditingModeHandler() {
        this.gridEditingMode.pipe(debounceTime(100)).subscribe(isEditingMode => {

            if (!isEditingMode) {
                this.editingItem = null;
            }

        });
    }

    protected doAfterContentInit() {

        if (!this.grid) {
            this.messageService.showError("DxDataGridComponent ou DxTreeListComponent não encontrado.");
            return;
        }

        // onRowValidating
        this.onRowValidationSubscription = this.grid.onRowValidating.subscribe(event => {

            if (this.innerPopup) {
                if (this.isNewRecord) {
                    event.oldData = {};
                    event.newData = Object.assign(event.newData, this.editingItem);
                }
            }

            event.isValid = true;
            event.cancel = false;
            const isValid = DevExtremeValidatorHelper.validate(event.newData, [
                {
                    key: event.newData['__KEY__'],
                    isUUIDKey: true
                },
                {
                    key: this.validationGroup,
                    isUUIDKey: false
                }
            ]);

            if (!isValid) {
                DevExtremeUtils.stopCancelPropagation(event);
            }

            if (this.onRowValidating) {
                this.currentValidationState = new CustomDataGridValidationState();
                this.currentValidationState.data = this.isNewRecord ? this.eventData : event.oldData;
                this.currentValidationState.editingData = this.editingItem;
                this.currentValidationState.isNewRecord = this.isNewRecord;
                this.currentValidationState.isValid = !event.cancel;
                this.currentValidationState.event = event;
                this.currentValidationState.contextData = this.contextData;
                this.currentValidationState.grid = this.grid;
                this.currentValidationState.custom = this;

                event.promise = this.isHasIncludeInDataGrid(this.currentValidationState, this.mapCompare).then(alreadyIn => {
                    this.currentValidationState.alreadyIn = alreadyIn;
                    let isSubValid: boolean | Promise<boolean> = this.onRowValidating(this.currentValidationState);

                    if (!(isSubValid instanceof Promise)) {
                        isSubValid = Promise.resolve(isSubValid);
                    }

                    return isSubValid.then((isValidPromise) => {
                        event.isValid = isValidPromise && isValid;

                        if (event.isValid) {
                            this.commitEditingItem(event.oldData, event.newData);
                        } else {
                            if (!this.errorMessages || this.errorMessages.length == 0) {
                                this.addErrorMessage("Foram encontrados erros na validação do formulário.");
                            }
                        }

                        this.commitAndCloseInnerPopup(event.isValid, event);
                    })
                });
            } else {

                if (isValid) {
                    this.commitEditingItem(event.oldData, event.newData);

                    //atualiza a grid ao final do onRowValidating
                    // setTimeout(() => {
                    //     this.refresh();
                    // })

                } else {
                    this.addErrorMessage("Foram encontrados erros na validação do formulário.");
                }

                this.commitAndCloseInnerPopup(isValid, event);
            }


        });


        // onRowClick
        this.onRowClickSubscription = this.grid.onRowClick.subscribe(event => {
            if (this.onRowClick) {
                this.onRowClick(event, this.contextData);
            }
        });

        // onRowCollapsed
        this.onRowCollapsedSubscription = this.grid.onRowCollapsed.subscribe(event => {
            if (this.onRowCollapsed) {
                this.onRowCollapsed(event, this.contextData);
            }
        });

        // onRowCollapsing
        this.onRowCollapsingSubscription = this.grid.onRowCollapsing.subscribe(event => {
            if (this.onRowCollapsing) {
                this.onRowCollapsing(event, this.contextData);
            }
        });

        // onRowExpanded
        this.onRowExpandedSubscription = this.grid.onRowExpanded.subscribe(event => {
            if (this.onRowExpanded) {
                this.onRowExpanded(event, this.contextData);
            }
        });

        // onRowExpanding
        this.onRowExpandingSubscription = this.grid.onRowExpanding.subscribe(event => {
            if (this.onRowExpanding) {
                this.onRowExpanding(event, this.contextData);
            }
        });

        // onRowInserted
        this.onRowInsertedSubscription = this.grid.onRowInserted.subscribe(event => {

            this.runOnAfterRowValidatedAndReload(this.dataSource.length - 1, true);

            if (this.parentDataGrid && this.parentEditTemplateData) {
                this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource, null, this.parentDataField);
            }

            if (this.onRowInserted) {
                this.onRowInserted(event, this.contextData);
            }
            this.gridEditingMode.next(false);

            this.extraEditData = new Map();
        });

        // onRowInserting
        this.onRowInsertingSubscription = this.grid.onRowInserting.subscribe(event => {
            this.verifyAsyncValidation(event);
            if (this.onRowInserting) {
                this.onRowInserting(event, this.contextData);
            }
        });

        // onRowPrepared
        this.onRowPreparedSubscription = this.grid.onRowPrepared.subscribe(event => {

            if (this.onRowPrepared) {
                this.onRowPrepared(event, this.contextData);
            }

            // no final da preparação da ultima linha - atualiza changes no objeto repassadado para 'onAfterRowValidated()'
            if (this.dataSource && event.data == this.dataSource[this.dataSource.length - 1] && this.editingRowIndex) {
                const index = this.editingRowIndex;
                this.editingRowIndex = null;
                this.runOnAfterRowValidated(this.dataSource[index], false);

                // Verificar necessidade de ajustar o tamanho da coluna de ações,
                // a priore será mantido o tamanho default, descomentar abaixo se realmente houver necessidade.
                // if (this.grid.instance && this.grid.editing.allowUpdating) {
                //     setTimeout(() => {
                //         this.domHandler.jQuery(this.grid.instance.element()).find('.dx-datagrid-headers col:last-child').width('85px');
                //         this.domHandler.jQuery(this.grid.instance.element()).find('.dx-datagrid-rowsview col:last-child').width('85px');
                //     });
                // }
            }

        });

        // onRowRemoved
        this.onRowRemovedSubscription = this.grid.onRowRemoved.subscribe(event => {

            if (this.reorder) this.reorderAfterRowRemoved();

            if (this.parentDataGrid && this.parentEditTemplateData) {
                this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource, null, this.parentDataField);
            }
            if (this.onRowRemoved) {
                this.onRowRemoved(event, this.contextData);
            }
        });

        // onRowRemoving
        this.onRowRemovingSubscription = this.grid.onRowRemoving.subscribe(event => {
            if (this.onRowRemoving) {
                this.onRowRemoving(event, this.contextData);
            }
        });

        // onRowUpdated
        this.onRowUpdatedSubscription = this.grid.onRowUpdated.subscribe(event => {

            this.runOnAfterRowValidatedAndReload(this.editingRowIndex, false);

            if (this.parentDataGrid && this.parentEditTemplateData) {
                this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource, null, this.parentDataField);
            }

            if (this.onRowUpdated) {
                this.onRowUpdated(event, this.contextData);
            }
            this.gridEditingMode.next(false);

            this.extraEditData = new Map();
        });

        // onRowUpdating
        this.onRowUpdatingSubscription = this.grid.onRowUpdating.subscribe(event => {
            this.currentUpdating = event;
            this.verifyAsyncValidation(event);
            if (this.onRowUpdating) {
                this.onRowUpdating(event, this.contextData);
            }
        });

        // onEditingStart
        this.onEditingStartSubscription = this.grid.onEditingStart.subscribe(event => {
            if (this.editingItem) {
                this.commitEditingItem(this.editingItem, event.data);
                return;
            }
            this.isNewRecord = false;
            this.doClearErrorMessages();
            this.clearAsyncValidationState();
            this.defineItemType(event);
            this.editingRowIndex = event.component.getRowIndexByKey(event.key);
            this.editingItem = this.newItemType();
            this.gridEditingMode.next(true);
            this.eventData = event.data;

            let dest = this.getEditingItemData();
            if (this.onEditingStart) {
                this.onEditingStart(event, this.contextData);
            }
            this.mergeObject(event.data, dest, true);
            if (this.itemType) {
                this.editingItem = this.jacksonService.clone(this.editingItem);
            }
            this.editingItemState = new CustomDataGridEditingState(this.editingItem, this, event.key, event.element, this.grid, this.isNewRecord);
            this.propagatePopupValue(this.editingItemState);
            this.showInnerPopup();

            this.extraEditData = new Map();

            if (event.cancel) {
                this.editingItem = null;
            }
        });

        this.onEditingCanceledSubscription = this.grid.onEditCanceled.subscribe(event => {
            this.editingItem = null;
        })

        // onInitNewRow
        this.onInitNewRowSubscription = this.grid.onInitNewRow.subscribe(event => {
            this.isNewRecord = true;
            this.doClearErrorMessages();
            this.clearAsyncValidationState();
            this.defineItemType(event);
            this.eventData = event.data;
            this.editingItem = this.newItemType();
            this.gridEditingMode.next(true);
            event.data = _.assign(this.editingItem, event.data); //define itemType of editItem to event.data (dx object)
            if (this.onInitNewRow) {
                this.onInitNewRow(event, this.contextData);
            }
            if (this.itemType) {
                this.editingItem = this.jacksonService.clone(this.editingItem);
            }
            this.editingItemState = new CustomDataGridEditingState(this.editingItem, this, null, event.element, this.grid, this.isNewRecord);
            this.propagatePopupValue(this.editingItemState);
            this.showInnerPopup();
            this.extraEditData = new Map();
        });

        // onSelectionChanged
        this.onSelectionChangedSubscription = this.grid.onSelectionChanged.subscribe(event => {

            if (this.grid.selection.mode == 'single' && !_.isEmpty(event.currentSelectedRowKeys)) {
                this.currentRowSelected = event.currentSelectedRowKeys[0];
            }

            // can't select disabled edit rows
            if (!_.isEmpty(event.currentSelectedRowKeys)) {
                const disabledKeys = event.currentSelectedRowKeys.filter(i => this.disabledEditRows.indexOf(i) > -1);
                if (disabledKeys && disabledKeys.length > 0)
                    event.component.deselectRows(disabledKeys);
            }

            if (this.onSelectionChanged) {
                this.onSelectionChanged(event, this.contextData);
            }
        });

        // onContentReady
        this.onContentReadySubscription = this.grid.onContentReady.subscribe(event => {
            if (this.onContentReady) {
                this.onContentReady(event, this.contextData);
            }
            this.applyPopupFullScreen();
        });

        this.onCellPreparedSubscription = this.grid.onCellPrepared.subscribe(event => {

            if (this.disableEditRow && event.rowType == "data" && this.disableEditRow(event, event.data)) {

                const cellElement = this.domHandler.jQuery(event.cellElement);

                // hide buttons edit / delete
                if (event.column.command === "edit") {
                    var $links = cellElement.find(".dx-link");
                    $links.remove();
                }

                // disable select
                if (event.column.command === 'select') {
                    const select = cellElement.find(".dx-select-checkbox");
                    let instance = CheckBox.getInstance(select) as CheckBox;
                    if (instance) {
                        this.disabledEditRows.push(event.data);
                        instance.option("disabled", true);
                        cellElement.off();
                        event.cellElement.style.pointerEvents = 'none';
                    }
                }
            }

            if (this.onCellPrepared) {
                this.onCellPrepared(event, this.contextData);
            }
        });

        //custom do after da grid
        this.gridAfterContentInit();
    }

    private getEditingItemData() {
        let data = this.editingItem;
        if (this.selfReference) {
            data = this.editingItem.self;
            if (!data) {
                data = this.newItemType();
                this.editingItem.self = data;
            }
        }
        return data;
    }

    cloneAndSetDataSource(dataSource) {
        this.dataSource = this.jacksonService.cloneArray(dataSource);
        if (!this.dataSource) {
            this.dataSource = [];
        }
        this.grid.dataSource = this.dataSource;
    }

    putEditData(key: string, value: any) {
        this.extraEditData.set(key, value);
    }

    getEditData(key: string): any {
        return this.extraEditData.get(key);
    }


    doAfterViewInit() {
        this.windowResizeSubscription = this.appState.resizedWindow.subscribe(ctx => {
            if (ctx == 'resize') {
                this.applyPopupFullScreen();
            }
        });

        this.gridAfterViewInit();
    }

    doAddErrorMessage(message: string) {
        this.addErrorMessage(message);
        if (this.innerPopup) {
            this.innerPopup.addErrorMessage(message);
        }
    }

    doClearErrorMessages() {
        this.clearErrorMessages();
        if (this.innerPopup) {
            this.innerPopup.clearErrorMessages();
        }
    }


    saveEditData() {
        if (this.grid) {
            this.grid.instance.saveEditData();
        }
    }

    saveChanges(event: any) {
        //if necessary create a validation function before save data
        this.grid.instance.saveEditData();
    }

    cancelEdit(event: any) {
        //if necessary create a validation function before save data
        this.grid.instance.cancelEditData();
    }

    saveEditing(data: any) {
        this.editingItem = data;
        this.saveEditData();
    }

    cancelEditData() {
        if (this.grid) {
            this.grid.instance.cancelEditData();
        }
    }

    repaintRows(rowIndexes: Array<number>) {
        if (this.grid) {
            this.grid.instance.repaintRows(rowIndexes);
        }
    }

    reloadDataSource() {
        if (this.grid.instance && this.grid.instance.getDataSource()) {
            this.grid.instance.getDataSource().reload();
        }
    }

    getEditingItem() {
        return this.editingItem;
    }

    setEditingItem(editingItem) {
        this.editingItem = editingItem;
    }

    getDataSource() {
        return this.dataSource;
    }

    refresh() {
        if (this.grid) {
            this.grid.instance.refresh();
        }
    }

    getGrid() {
        return this.grid;
    }

    getGridInstance() {
        return this.grid.instance;
    }

    setDataSource(value: any[]): void {
        this.dataSource = value;
        this.grid.dataSource = this.dataSource;
    }


    bindByProperty(data: any, value: any, dataField?: string): void {
        this.bindProperty(data, value, null, dataField);
    }


    bindProperty(data: any, value: any, types?: Function[], dataField?: string): void {

        if (!data) {
            this.throwError('CustomDataGrid.bindProperty(): data não informado.');
        }

        if (!data.item && !data.column) {
            this.throwError('CustomDataGrid.getProperty(): metadados inválidos! Verifique se todos os templates de edição do seu grid possuem a tag ng-container como o atributo *ngIf="data.isOnForm"');
        }

        let property;
        if (_.isEmpty(dataField)) {
            property = data.item ? data.item.dataField : data.column.dataField;
        } else {
            property = dataField;
        }

        if (!property || property == '') {
            this.throwError('CustomDataGrid.bindProperty(): dataField não informado. Verifique se o dataField está sendo informado na tag dxi-item do seu template.');
        }

        if (value && value.component && value.element && value.event) {
            this.throwError('CustomDataGrid.bindProperty(): [dataField = \'' + property + '\'] value é um evento do DevExtreme, e não um valor de um editor! Tente alterar seu template para utilizar $event.value');
        }

        if (!this.editingItem) {
            return;
        }

        let obj = this.editingItem;

        if (property == 'self') {
            this.editingItem.self = value;
            return;
        }

        let objs = [];
        let keys = property.split('.');

        let type: any = this.itemType;
        if (!types && type) {
            types = [];
            for (let key of keys) {
                type = jacksonMetadata.getAttributeType(type, key);
                if (type) {
                    types.push(type);
                } else {
                    break;
                }
            }
        }

        for (let idx = 0; idx < keys.length - 1; idx++) {

            let typep = types[idx];

            let prop = keys[idx];

            let subObj = obj[prop];
            if (!subObj) {
                subObj = {};
                if (typep) {
                    subObj['__type__'] = typep;
                }

                obj[prop] = subObj;
            }

            obj = subObj;
            objs.push(subObj);

        }

        obj[keys[keys.length - 1]] = value;

        if (keys.length == 1 && types.length == 0) {
            data.setValue(value);
        }

    }

    protected getDataField(dataField: string, data: any): string {
        return dataField ? dataField : (data.item ? data.item.dataField : data.column.dataField);
    }

    getProperty(data: any, dataField?: string): any {

        if (!data) {
            this.throwError('CustomDataGrid.getProperty(): data não informado.');
        }
        if (!data.item && !data.column && !dataField) {
            this.throwError('CustomDataGrid.getProperty(): metadados inválidos! Verifique se todos os templates de edição do seu grid possuem a tag ng-container como o atributo *ngIf="data.isOnForm"');
        }

        let property;
        if (_.isEmpty(dataField)) {
            property = this.getDataField(null, data);
        } else {
            property = dataField;
        }

        let keys = property.split(".");

        let obj = this.editingItem;

        if (!obj) {
            return null;
        }

        return this.findValue(keys, obj);

    }

    getValue(dataField) {
        return this.findValue([dataField], this.editingItem);
    }

    initializeAddButtonEnterKey(event: any) {
        event.component.registerKeyHandler("enter", key => this.addNewRow(key));
    }

    addNewRow(event: any) {
        if (this.onAddNewRow) {
            this.onAddNewRow();
            return;
        }
        if (this.validateAddNewRow instanceof Function) {
            if (!this.validateAddNewRow(this.dataSource, event)) {
                return;
            }
        }

        if (this.validateAddNewRow) {
            this.grid.instance.addRow();
        }

    }

    initializeRemoveButtonEnterKey(event: any) {
        event.component.registerKeyHandler("enter", key => this.removeSelectedRows(key));
    }

    removeSelectedRows(event: any, exibeConfirmacao:boolean = true, reorder?: boolean) {
        if (this.onRemoveRow) {
            this.onRemoveRow();
            return;
        }

        if (this.validateRemoveSelectedRows) {
            if (!this.validateRemoveSelectedRows()) {
                return;
            }
        }

        const keys = this.grid.instance.getSelectedRowKeys().reverse();
        if (keys.length > 0) {

            //override confirmation delete message to empty
            this.grid.editing.texts.confirmDeleteMessage = '';


            let result: Promise<boolean>;

            if (exibeConfirmacao) {
                result = confirm(CONFIRMATION_MESSAGE, "");
            } else {
                result = new Promise((resolve, reject) => resolve(true));
            }

            result.then((dialogResult) => {

                if (dialogResult) {

                    keys.forEach(key => {
                        let idx = this.dataSource.findIndex(item => item == key);
                        let dataToRemove = this.dataSource[idx];
                        this.dataSource.splice(idx, 1);

                        if (this.onRowRemoved) {
                            let event = {data: dataToRemove};
                            this.onRowRemoved(event, this.contextData);
                        }

                    });

                    if(this.reorder && reorder) this.reorderAfterRowRemoved();
                    this.grid.instance.refresh();

                    if (this.parentDataGrid && this.parentEditTemplateData) {
                        this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource);
                    }

                }

                this.grid.editing.texts.confirmDeleteMessage = CONFIRMATION_MESSAGE;

            });
        } else {
            this.messageService.show('Nenhum registro selecionado');
        }

    }

    getInnerPopupErrorMessages() {
        if (this.innerPopup) {
            return this.innerPopup.errorMessages;
        }
        return [];
    }

    prepareInnerModal() {
        const popup = this.innerPopup;

        if (popup) {
            this.popupOnAceitarClickedSubscription = popup.onAceitarButtonClicked.subscribe(() => {
                const state = this.editingItemState;

                if (state && !state.isNewRecord) {
                    let obj = {
                        brokenRules: [],
                        component: state.component,
                        element: state.element,
                        errorText: null,
                        isValid: true,
                        key: state.dxData,
                        newData: popup.getContentValue(),
                        oldData: state.dxData
                    };

                    state.component.onRowValidating.next(obj);
                }


                let isValid = true;
                if (popup.validationGroup) {
                    isValid = popup.isValid()
                }
                if (isValid) {
                    this.innerPopup.aceitarButtonWasClicked = true;
                    const data = popup.getContentValue();
                    this.saveEditing(data);
                }
            });

            this.popupOnFecharClikedSubscription = popup.onClose.subscribe((aceitarClicked) => {
                if (!aceitarClicked) {
                    this.cancelEditData();
                }
            });

        }
    }

    clearAsyncValidationState() {
        this.currentValidationState = null;
    }

    runOnAfterRowValidatedAndReload(rowIndex, isNewRecord) {

        this.runOnAfterRowValidated(this.dataSource[rowIndex], isNewRecord);

        this.updateItemType(rowIndex);

        this.gridRunOnAfterRowValidatedAndReload();

    }

    runOnAfterRowValidated(data: any, isNewRecord: boolean) {
        if (this.onAfterRowValidated) {
            this.onAfterRowValidated(data, isNewRecord);
        }
    }

    applyPopupFullScreen() {
        if (this.grid && this.grid.editing['mode'] == 'popup' && this.popupFullScreen) {
            const height = this.getHeighWindowComponent();
            const width = this.getWidthWindowComponent();
            const padding_default = 90;


            this.dxPopupHeight = height;
            this.dxPopupWidth = (width - padding_default);

            this.grid.editing.popup['height'] = height;
            this.grid.editing.popup['width'] = width;

        }
    }

    _isHasIncludeInDataGrid(event: CustomDataGridValidationState, map: string | string[]) {
        return this.isHasIncludeInDataGrid(event, map);
    }

    showInnerPopup() {
        if (this.innerPopup) {

            // esconde o popup default da dxDataGrid
            setTimeout(() => {
                const dom = this.domHandler;
                dom.jQuery(".dx-overlay-wrapper").each(function () {
                    if (dom.jQuery(this).hasClass('dx-datagrid-edit-popup')) {
                        dom.jQuery(this).css('display', 'none')
                    }
                });
            });
            this.innerPopup.visible = true;
            this.innerPopup.clearErrorMessages();
        }
    }

    canReorderRow() {
        return this.reorder && this.grid.instance.getSelectedRowKeys().length == 1; // apenas um objeto selecionado, poderá ser reordenado
    }

    getParentIdExpr() {
        if (typeof this.grid.parentIdExpr === 'string') {
            return this.grid.parentIdExpr;
        }
    }

    moveObjectGrid(selectedIndexRow, selected, targetIndexRow, target) {

        //movimenta obj na grid
        this.grid.dataSource[selectedIndexRow] = target;
        this.grid.dataSource[targetIndexRow] = selected;

        //atualiza valor da property de acordo com o índice
        const oldValue = selected[this.reorderProperty];
        selected[this.reorderProperty] = target[this.reorderProperty];
        target[this.reorderProperty] = oldValue;

        this.onRowMoved.emit({
            from: selected,
            target: target
        });

    }

    adjustHeight(height: number) {
        this._calcHeight = height;
        if (this.grid && !this.editingItem) {
            this.grid.height = height;
            if (this.showGridToolBar) {
                this.grid.height -= this.getToolbarHeight();
            }
        }
    }

    changeItemType(itemType: Function) {
        this.itemType = itemType;
        if (!_.isNil(this.preserveFieldsItemType)) {
            const editingItemPreserved = _.pick(this.editingItem, this.preserveFieldsItemType);
            this.editingItem = this.newItemType();
            this.gridEditingMode.next(true);
            this.mergeObject(editingItemPreserved, this.editingItem, true);
        } else {
            this.editingItem = this.newItemType();
            this.gridEditingMode.next(true);
        }
    }

    private findValue(keys, obj: any): any {
        let value = null;
        for (let key of keys) {
            if (!_.isNil(obj[key]) || _.isNumber(obj[key])) {
                obj = obj[key];
                value = obj;
            } else {
                value = null;
                break;
            }
        }
        return value;
    }

    private throwError(error: string) {
        if (this.errorThrown) {
            return;
        }
        this.errorThrown = true;
        console.log(error);
        throw error;
    }

    //Propaga o edit item para o inner popup
    private propagatePopupValue(value: any) {
        if (this.innerPopup) {
            this.innerPopup.propagateValue(value);
        }
    }

    private commitEditingItem(oldData: any, newData: any): void {

        if (oldData && !this.selfReference) {
            this.mergeObject(oldData, newData, true);
        }

        let orig = this.getEditingItemData();
        this.mergeObject(orig, newData, _.isNil(oldData));

        _.forOwn(newData, (value, key) => {

            if (key == "__update_flag__") {
                newData[key] = undefined;
            }

        });

    }

    private mergeObject(orig: any, dest: any, replaceObjs: boolean, ctx?: Map<Function, Set<any>>): void {

        if (!ctx) {
            ctx = new Map();
        }

        _.forOwn(orig, (value, key) => {

            if (this.removekeyExpr) {
                let keyId = this.grid.keyExpr ? this.grid.keyExpr : '__KEY__';

                if (key == keyId) {
                    return;
                }
            }

            let destValue = value;
            if (value && value['__type__']) {
                destValue = !replaceObjs && dest[key] && dest[key] != '__updated__' ? dest[key] : new value['__type__']();
                delete value['__type__'];
                this.mergeObject(value, destValue, replaceObjs, ctx);
            }
            if (value && value['__typeId__']) {
                let attrType: any = jacksonMetadata.getJacksonType(value['__typeId__']);

                let objs = ctx.get(attrType);
                if (!objs) {
                    objs = new Set();
                    ctx.set(attrType, objs);
                }

                destValue = !replaceObjs && dest[key] && dest[key] != '__updated__' ? dest[key] : new attrType();

                if (!objs.has(value)) {
                    objs.add(value);
                    this.mergeObject(value, destValue, replaceObjs, ctx);
                } else {
                    destValue = value;
                }
            }

            dest[key] = destValue;

        });

    }

    private commitAndCloseInnerPopup(isValid: boolean, event: any) {
        if (isValid && this.innerPopup) {
            this.commitEditingItem(event.newData, event.oldData);
            this.closeInnerPopup();
        }
    }

    private verifyAsyncValidation(event) {
        if (this.currentValidationState && this.currentValidationState.getAsyncValidator()) {
            this.currentValidationState.deferred = $.Deferred();
            event.cancel = this.currentValidationState.deferred.promise();
            this.currentValidationState.getAsyncValidator()();
        }
    }

    private closeInnerPopup() {
        if (this.innerPopup) {
            this.innerPopup.close();
        }
    }

    private getHeighWindowComponent(): number {
        return this.domHandler.jQuery(".root-component-restricted-area").height();
    }

    private getWidthWindowComponent(): number {
        return this.domHandler.jQuery(".root-component-restricted-area").width();
    }

    /**
     * Metodo que compara se o objeto inserido já existe no dataSource da grid, com base no mapa de comparação;
     *
     * @param { CustomDataGridValidationState } event
     * @param string | string[] Mapa de comparação,
     *
     * Passar o mapa de comparação pelo Input() mapCompare, o mesmo será retornardo no métodos onRowValidation na
     * na variável state.alReadyIn = true caso exista e false, caso nao exista.
     * example:
     *
     *      // Compara DataSource.tipoAplicacaoFinanceira.id == obetoEditado.tipoAplicacaoFinanceira.id
     *      let mapCompare = ['tipoAplicacaoFinanceira.id'];
     *      let mapCompare = 'tipoAplicacaoFinanceira.id';
     *
     *      // Compara DataSource.id == obetoEditado.id
     *      let mapCompare = 'id';
     *
     *      // Compara DataSource.codigoAplicacaoFixo.id == obetoEditado.codigoAplicacaoFixo.id
     *               e DataSource.codigoAplicacaoVariavel.id == obetoEditado.codigoAplicacaoVariavel.id
     *      let mapCompare = ['codigoAplicacaoFixo.id', 'codigoAplicacaoVariavel.id'];
     *
     * @returns {boolean}
     */
    private async isHasIncludeInDataGrid(event: CustomDataGridValidationState, map: string | string[]) {
        if (!map || (_.isArray(map) && _.isEmpty(map))) {
            return false;
        }

        let dataSource = event.grid.instance.option('dataSource');
        var filterExpr =  event.grid.instance.getCombinedFilter();
        let dsDev = new DataSource({
            store: dataSource,
            pageSize: 0,
            paginate: false
        });

        if(!!filterExpr) {
            dsDev.filter(filterExpr);
        }
        dataSource = await dsDev.load();

        let isNewRecord = event.isNewRecord;

        if (!_.isEmpty(dataSource)) {
            let data = event.data;
            let edit = event.editingData;

            if (this.selfReference) {
                edit = edit.self;
            }

            if (!isNewRecord) {
                dataSource = dataSource.filter(obj => {
                    return obj != data;
                });
            }

            if (edit) {
                let sizePropCompare: number = _.isArray(map) ? map.length : 1;
                for (let obj of dataSource) {
                    let size = sizePropCompare;
                    if (_.isArray(map)) {

                        for (let prop of map) {
                            if (this.compare(obj, edit, prop)) {
                                size--;
                            }
                        }
                        if (size == 0) {
                            return true;
                        }
                    } else {
                        if (this.compare(obj, edit, map)) {
                            return true;
                        }
                    }
                }
            }
        }
    }

    private compare(obj: any, edit: any, prop: string) {
        const realObject = _.get(obj, prop);
        const realEdit = _.get(edit, prop);

        if (realObject instanceof Date && realEdit instanceof Date) {
            if (realObject.getTime() == realEdit.getTime()) {
                return true;
            }
        } else {
            if (realObject == realEdit) {
                return true;
            }
        }
        return false;
    }

    private updateItemType(rowIndex) {

        this.dataSource.forEach((element, idx) => {

            //update instance of record in row index
            if (rowIndex === idx) {
                let item = this.newItemType();
                _.forOwn(element, (obj, prop) => {

                    //ignore prop '@type'
                    if (prop != '@type') {
                        item[prop] = obj;
                    }

                });
                this.dataSource[idx] = item;
            }
        });

    }

    private defineItemType(event) {
        if (this.isNewRecord && this.subItemTypes && this.subItemTypeDefault) {
            const subtype = this.subItemTypes.find(type => type == this.subItemTypeDefault);
            this.applySubtype(subtype);
        } else if (!this.isNewRecord && this.subItemTypes) {
            const subtype = this.subItemTypes.find(type => event.data instanceof type);
            this.applySubtype(subtype);
        }
    }

    private applySubtype(subtype) {
        if (_.isNil(subtype)) {
            this.throwError(`Configuração inválida. Verifique os 'subItemTypes' possíveis e se existe um 'subItemTypeDefault' configurado`);
        } else {
            this.itemType = subtype;
        }
    }

    private newItemType() {
        return this.itemType ? new (this.itemType as any)() : {};
    }

    protected doOnDestroy() {
        if (this.onRowValidationSubscription) {
            this.onRowValidationSubscription.unsubscribe();
        }
        if (this.onRowClickSubscription) {
            this.onRowClickSubscription.unsubscribe();
        }
        if (this.onRowCollapsedSubscription) {
            this.onRowCollapsedSubscription.unsubscribe();
        }
        if (this.onRowCollapsingSubscription) {
            this.onRowCollapsingSubscription.unsubscribe();
        }
        if (this.onRowExpandedSubscription) {
            this.onRowExpandedSubscription.unsubscribe();
        }
        if (this.onRowExpandingSubscription) {
            this.onRowExpandingSubscription.unsubscribe();
        }
        if (this.onRowInsertedSubscription) {
            this.onRowInsertedSubscription.unsubscribe();
        }
        if (this.onRowInsertingSubscription) {
            this.onRowInsertingSubscription.unsubscribe();
        }
        if (this.onRowPreparedSubscription) {
            this.onRowPreparedSubscription.unsubscribe();
        }
        if (this.onRowRemovedSubscription) {
            this.onRowRemovedSubscription.unsubscribe();
        }
        if (this.onRowRemovingSubscription) {
            this.onRowRemovingSubscription.unsubscribe();
        }
        if (this.onRowUpdatedSubscription) {
            this.onRowUpdatedSubscription.unsubscribe();
        }
        if (this.onRowUpdatingSubscription) {
            this.onRowUpdatingSubscription.unsubscribe();
        }
        if (this.onEditingStartSubscription) {
            this.onEditingStartSubscription.unsubscribe();
        }
        if (this.onEditingCanceledSubscription) {
            this.onEditingCanceledSubscription.unsubscribe();
        }
        if (this.onInitNewRowSubscription) {
            this.onInitNewRowSubscription.unsubscribe();
        }
        if (this.popupOnAceitarClickedSubscription) {
            this.popupOnAceitarClickedSubscription.unsubscribe();
        }
        if (this.popupOnFecharClikedSubscription) {
            this.popupOnFecharClikedSubscription.unsubscribe();
        }
        if (this.dataSourceChangeSubscription) {
            this.dataSourceChangeSubscription.unsubscribe();
        }
        if (this.windowResizeSubscription) {
            this.windowResizeSubscription.unsubscribe();
        }
        //custom do doOnDestroy
        this.gridOnDestroy()
    }

    protected getToolbarHeight(): number {
        return this.heightToolbar;
    }

    //
    /******************************************* TEMPLATE METHIDS  ***************************************************/
    protected gridAfterContentInit() {
    }

    protected gridAfterViewInit() {
    }

    protected gridOnDestroy() {
    }

    protected gridRunOnAfterRowValidatedAndReload() {
    }

    protected reorderAfterRowRemoved() {
    }


}

export interface RowMoved {
    from: any
    target: any
}
