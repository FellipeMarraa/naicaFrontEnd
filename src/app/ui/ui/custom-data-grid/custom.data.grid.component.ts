import {Component, ContentChild, ContentChildren, Injector, Input, QueryList, SimpleChanges} from "@angular/core";
import {DxDataGridComponent} from "devextreme-angular";
import {Subscription} from "rxjs";
import {AbstractGrid} from "../grid/abstract.grid";
import {TabPanelService} from "../services/tab.panel.service";

import * as _ from "lodash";
import {CustomValidationResult} from "../base-component/custom.validation";

@Component({
    selector: 'custom-data-grid',
    template: `
        <div [hidden]="!visible" [ngClass]="{'has-inner-popup': innerPopup}"
             [ngStyle]="{'padding-top': '10px', 'width': width, 'height': height}">
            <auto-size-container [width]="_width" [height]="_height" [marginWidth]="marginWidth" [marginHeight]="marginHeight" (heightChange)="adjustHeight($event)">

                <grid-toolbar [visible]="showGridToolBar" [title]="gridTitle" [width]="widthToolbar" [cssClass]="styleValidator"
                              [height]="heightToolbar">
                    <dx-button *ngIf="reorder"
                               icon="fa fa-arrow-down" (click)="moveRowDown()"></dx-button>

                    <dx-button *ngIf="reorder" style="margin-right: 5px"
                               icon="fa fa-arrow-up" (click)="moveRowUp()"></dx-button>

                    <span *ngIf="!isValidGrid" class="tab-icon-error"><i class="fa fa-exclamation-circle"></i></span>

                    <ng-content select="[toolbar-custom-area]"></ng-content>

                    <dx-button #addButton style="margin-left: 5px"
                               [disabled]="disableButtonAddNewRow"
                               [visible]="showButtonAddNewRow" [icon]="iconButtonAddNewRow" [hint]="hintAddRow"
                               (onInitialized)="initializeAddButtonEnterKey($event)"
                               (click)="addNewRow($event)"></dx-button>

                    <dx-button #removeButton
                               [disabled]="disableButtonRemoveSelectedRows"
                               [visible]="showButtonRemoveSelectedRows" [icon]="iconButtonRemoveSelectedRows" [hint]="hintRemoveRow"
                               (onInitialized)="initializeRemoveButtonEnterKey($event)"
                               (click)="removeSelectedRows($event,true,true)"></dx-button>

                </grid-toolbar>

                <ng-content select="dx-data-grid"></ng-content>
            </auto-size-container>

            <dx-validator [adapter]="adapterConfigValidator" [validationGroup]="validationGroupForm">
                <dxi-validation-rule type="custom"
                                     [validationCallback]="validationCallback"
                                     [reevaluate]="true"
                                     [message]="requiredErrorMessage" ></dxi-validation-rule>
            </dx-validator>

        </div>
    `,
    providers: [TabPanelService]
})
export class CustomDataGridComponent extends AbstractGrid {

    @ContentChildren(DxDataGridComponent)
    allGrids: QueryList<DxDataGridComponent>;

    @ContentChild(DxDataGridComponent, {static: true})
    grid: DxDataGridComponent;

    /******************************************* INPUTS **************************************************************/

    @Input()
    editFormConf: any;

    @Input()
    groupOrderProperty: string;

    /**
     * Grupo de validacao do form, no contesto onde a tabela esta inserida.
     */
    @Input()
    validationGroupForm: string;



    /******************************************* SUBSCRIPTIONS *******************************************************/

    private contentReadySubscription: Subscription;
    private cellPreparedSubscription: Subscription;

    constructor(private injector: Injector) {
        super(injector);
        // this.validationGridCallback = this.validationGridCallback.bind(this);
    }

    /** Validacao da grid **/
    callbacksValidator = [];
    styleValidator: string = "";
    isValidGrid: boolean = true;
    adapterConfigValidator = {
        getValue: () => {
            return this.grid.dataSource;
        },
        applyValidationResults: (e) => {
            this.isValidGrid = e.isValid;
            this.styleValidator = e.isValid ? "" : "bordaValidate";
        },
        validationRequestsCallbacks: this.callbacksValidator
    };


    /** After DxDataGrid content **/
    protected gridAfterContentInit(): void {

        this.contentReadySubscription = this.grid.onContentReady.subscribe((e) => this.gridContentReady(e));
        this.cellPreparedSubscription = this.grid.onCellPrepared.subscribe((e) => this.gridCellPrepared(e));

        if (this.grid.editing && this.grid.editing.form && this.grid.editing.form.items) {
            let updateEditorFunc = (evt) => {
                let comp = evt.element;
                window.setTimeout(evt => {
                    let input = this.domHandler.jQuery(comp).find('input')[0];
                    let valueEvent = new Event('change', {
                        bubbles: true,
                        cancelable: true,
                    });
                    input.value = "updated";
                    input.dispatchEvent(valueEvent);
                });
            };
            this.grid.editing.form.items.push({
                dataField: '__update_flag__',
                label: {visible: false},
                editorOptions: {visible: false, 'onInitialized': updateEditorFunc}
            });
            this.grid.columns.push({
                dataField: '__update_flag__',
                visible: false
            });
        }


        if (this.parentDataGrid && this.parentEditTemplateData) {

            if (this.parentDataGrid.gridsFilhos) {
                this.parentDataGrid.gridsFilhos.set(this.getDataField(this.parentDataField, this.parentEditTemplateData), this);
            }
            this.cloneAndSetDataSource(this.parentDataGrid.getProperty(this.parentEditTemplateData, this.parentDataField));

        } else {
            this.dataSource = <any[]>this.grid.dataSource;
        }

        this.dataSourceChangeSubscription = this.grid.dataSourceChange.subscribe((ds) => {
            this.dataSource = ds;
        });

        /* Redimencionamento de colunas default */
        this.grid.allowColumnResizing = true;

        /* O comportamento padrão foi alterado de 'sem paginação' para 'scroll virtual',
        * a fim de minimizar problemas de performance quando o datasource possui muitos
        * registros
        *  */

        if (!this.hasCustomPagingConf) {
            this.grid.paging = {
                pageSize: 10
            };
            //
            //     this.grid.pager = {
            //         showPageSizeSelector: false
            //     };
        }

        this.grid.scrolling = {
            mode: 'virtual'
        };

        this.grid.loadPanel = {
            enabled: this.enableLoadPanel
        };


        if (!this.hasCustomSelectionConf) {
            this.grid.selection = {
                allowSelectAll: true,
                selectAllMode: 'allPages',
                mode: 'multiple',
                showCheckBoxesMode: 'always'
            };
        }

        if (this.editFormConf) {
            this.grid.editing = {
                form: this.editFormConf,
            }
        }

        //default config if popup
        if (this.grid.editing.mode == 'popup') {
            this.grid.editing.allowAdding = this.allowAdding;
            this.grid.editing.allowDeleting = this.allowDeleting;
            this.grid.editing.allowUpdating = this.allowUpdating;
            this.grid.editing.popup.position = {
                my: 'center', at: 'center', of: '#content-body'
            };
            this.grid.editing.form.alignItemLabels = true;
            this.grid.editing.form.colCount = 1;
            this.grid.editing.texts.saveRowChanges = 'Aplicar';
            this.grid.editing.texts.cancelRowChanges = 'Cancelar';
        }

        if (this.grid.editing.mode == 'form') {
            this.grid.editing.texts.saveRowChanges = 'Aplicar';
            this.grid.editing.texts.cancelRowChanges = 'Cancelar';
        }

        // inner modal
        this.prepareInnerModal();

    }

    protected gridRunOnAfterRowValidatedAndReload() {
        this.grid.instance.getDataSource().reload();
    }

    protected reorderAfterRowRemoved() {
        this.dataSource.forEach((data, idx) => {
            data[this.reorderProperty] = idx + 1;
        });
    }

    updateChildGridDataSource(dataField: string, dataSource: any[]) {
        const grid = this.gridsFilhos.get(dataField);
        if (grid) {
            grid.cloneAndSetDataSource(dataSource);
            this.bindProperty(grid.parentEditTemplateData, dataSource, null, this.parentDataField);
        }
    }

    getChildGridDataSource(dataField: string): any[] {
        const grid = this.gridsFilhos.get(dataField);
        if (grid) {
            return grid.dataSource;
        }
        return null;
    }

    moveRowUp() {
        if (this.canReorderRow()) {
            const selected = this.getGridInstance().getSelectedRowKeys()[0];
            const selectedIndex = this.getGridInstance().getRowIndexByKey(selected);
            if (selectedIndex != 0) {
                const targetIndex = selectedIndex - 1;
                const target = this.getGridInstance().getKeyByRowIndex(targetIndex);

                //obtem o índice real no datasource
                const selectedIndexRow = (this.grid.dataSource as any[]).indexOf(selected);
                const targetIndexRow = (this.grid.dataSource as any[]).indexOf(target);

                this.moveObjectGrid(selectedIndexRow, selected, targetIndexRow, target);

                if (this.parentDataGrid && this.parentEditTemplateData) {
                    this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource);
                }

            }
        }
    }

    moveRowDown() {
        if (this.canReorderRow()) {
            const selected = this.getGridInstance().getSelectedRowKeys()[0];
            const selectedIndex = this.getGridInstance().getRowIndexByKey(selected);
            if (selectedIndex != this.getGridInstance().getDataSource().items().length - 1) {
                const targetIndex = selectedIndex + 1;
                const target = this.getGridInstance().getKeyByRowIndex(targetIndex);

                //obtem o índice real no datasource
                const selectedIndexRow = (this.grid.dataSource as any[]).indexOf(selected);
                const targetIndexRow = (this.grid.dataSource as any[]).indexOf(target);

                this.moveObjectGrid(selectedIndexRow, selected, targetIndexRow, target);

                if (this.parentDataGrid && this.parentEditTemplateData) {
                    this.parentDataGrid.bindProperty(this.parentEditTemplateData, this.dataSource);
                }
            }
        }
    }

    private gridContentReady(event: any) {
        event.component.columnOption("command:edit", "fixed", true);

        const element = this.domHandler.jQuery(".dx-datagrid-header-panel");
        if (element) {
            element.remove();
        }

        if (this.onContentReady) {
            this.onContentReady(event);
        }

    }

    private gridCellPrepared(event: any) {

        if (event.rowType === "data" && event.column.command === "edit") {
            let isEditing = event.row.isEditing, cellElement = event.cellElement;

            if (isEditing) {
                let saveLink = cellElement.querySelector(".dx-link-save"),
                    cancelLink = cellElement.querySelector(".dx-link-cancel"),
                    deleteLink = cellElement.querySelector(".dx-link-delete");

                if (saveLink) {
                    saveLink.classList.add("dx-icon-save");
                    saveLink.textContent = "";
                }

                if (cancelLink) {
                    cancelLink.classList.add("dx-icon-revert");
                    cancelLink.textContent = "";
                }

                if(deleteLink){
                    deleteLink.style.display = 'inline-block';
                    deleteLink.classList.add("dx-icon-trash");
                    deleteLink.textContent = "";
                }

            } else {
                let editLink = cellElement.querySelector(".dx-link-edit"),
                    deleteLink = cellElement.querySelector(".dx-link-delete");

                if (editLink) {
                    editLink.style.display = 'inline-block';
                    editLink.classList.add("dx-icon-edit");
                    editLink.textContent = "";
                }

                if (deleteLink) {
                    deleteLink.style.display = 'inline-block';
                    deleteLink.classList.add("dx-icon-trash");
                    deleteLink.textContent = "";
                }
            }
        }

        if (this.onCellPrepared) {
            this.onCellPrepared(event);
        }
    }

    runOnAfterRowValidated(data: any, isNewRecord: boolean) {
        if (this.reorder && isNewRecord) {
            const sequencial = this.getNextSequencial(data);
            data[this.reorderProperty] = sequencial;
        }
    }

    private getNextSequencial(object: any) {
        let dataSource = this.dataSource;
        if (this.groupOrderProperty) {
            dataSource = this.dataSource.filter(data =>
                data[this.groupOrderProperty] === object[this.groupOrderProperty]
            );
        }
        return Math.max.apply(Math, dataSource.map(o => o[this.reorderProperty] ? o[this.reorderProperty] : 0)) + 1;
    }

    gridOnDestroy(): void {
        if (this.contentReadySubscription) {
            this.contentReadySubscription.unsubscribe();
        }

        if (this.cellPreparedSubscription) {
            this.cellPreparedSubscription.unsubscribe();
        }
    }

    updateGridHeight(height: number) {
        this.grid.height = height - 60;
        this.grid.instance.refresh();
    }

    modifySelectionConf() {
        this.grid.selection = {
            mode: 'single'
        };
    }

    providedValue(): any {
        return !!this.grid && !!this.grid.instance ? (this.grid as DxDataGridComponent).instance.getSelectedRowsData() : null;
    }

}
