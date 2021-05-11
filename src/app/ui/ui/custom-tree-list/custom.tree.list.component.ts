import {Component, ContentChild, Injector, Input} from "@angular/core";
import {DxTreeListComponent} from "devextreme-angular";
import {Subscription} from "rxjs";
import {AbstractGrid} from "../grid/abstract.grid";
import * as _ from "lodash";
import data from "devextreme/bundles/dx.all";


@Component({
    selector: 'custom-tree-list',
    template: `
        <div [hidden]="!visible" [ngStyle]="{'padding-top': paddingTop, 'width': width, 'height': height}">
            <auto-size-container [width]="_width" [height]="_height" [marginWidth]="marginWidth" [marginHeight]="marginHeight" (heightChange)="adjustHeight($event)">
                <grid-toolbar [visible]="showGridToolBar" [title]="gridTitle" [width]="widthToolbar"
                              [height]="heightToolbar">
    
                    <dx-button *ngIf="reorder"
                               icon="fa fa-arrow-down" (click)="moveRowDown()"></dx-button>
    
                    <dx-button *ngIf="reorder" style="margin-right: 5px"
                               icon="fa fa-arrow-up" (click)="moveRowUp()"></dx-button>
    
                    <ng-content></ng-content>
    
                    <dx-button #addButton style="margin-left: 5px"
                               [disabled]="disableButtonAddNewRow"
                               [visible]="showButtonAddNewRow" icon="fa fa-plus" [hint]="hintAddRow"
                               (onInitialized)="initializeAddButtonEnterKey($event)"
                               (click)="addNewRow($event)"></dx-button>
    
                    <dx-button #removeButton
                               [disabled]="disableButtonRemoveSelectedRows"
                               [visible]="showButtonRemoveSelectedRows" icon="fa fa-minus" [hint]="hintRemoveRow"
                               (onInitialized)="initializeRemoveButtonEnterKey($event)"
                               (click)="removeSelectedRows($event)"></dx-button>
    
                    <dx-button #saveRowsButton
                               [disabled]="disableButtonSaveRow"
                               [visible]="showButtonSaveRow" icon="fa fa-save" [hint]="hintSaveRow"
                               (onInitialized)="initializeSaveRowsEnterKey($event)"
                               (click)="saveChanges($event)"></dx-button>
    
                    <dx-button #cancelEditButton
                               [disabled]="cancelEditButtonRow"
                               [visible]="showButtonCancelEdit" icon="fa fa-undo" [hint]="hintCancelEdit"
                               (onInitialized)="initializeCancelEditEnterKey($event)"
                               (click)="cancelEdit($event)"></dx-button>
    
                </grid-toolbar>
                <ng-content select="dx-tree-list"></ng-content>
            </auto-size-container>
        </div>
    `
})
export class CustomTreeListComponent extends AbstractGrid {

    @ContentChild(DxTreeListComponent, {static: true})
    grid: DxTreeListComponent;

    /******************************************* SUBSCRIPTIONS *******************************************************/

    private contentReadySubscription: Subscription;
    private cellPreparedSubscription: Subscription;

    /******************************************* INPUTS **************************************************************/
    @Input()
    paddingTop: string = '10px';

    @Input()
    disableButtonSaveRow: boolean = false;

    @Input()
    cancelEditButtonRow: boolean = false;

    @Input()
    showButtonSaveRow: boolean = false;

    @Input()
    showButtonCancelEdit: boolean = false;

    @Input()
    hintSaveRow: string = "Salvar alterações";

    @Input()
    hintCancelEdit: string = "Descartar alterações";

    @Input()
    columnAutoWidth: boolean = false;

    @Input()
    wordWrapEnabled: boolean = false;

    @Input()
    showBorders: boolean = false;

    @Input()
    showRowLines: boolean = false;

    @Input()
    showColumnLines: boolean = false;

    @Input()
    autoExpandAll: boolean = false;

    @Input()
    onCellPrepared: Function;

    @Input()
    onContentReady: Function;

    constructor(private injector: Injector) {
        super(injector);
        this.removekeyExpr = false;
    }

    /** After TreeListGrid content **/
    protected gridAfterContentInit() {

        this.contentReadySubscription = this.grid.onContentReady.subscribe((e) => {
            this.treeListOnContentReady(e);
        });

        this.cellPreparedSubscription = this.grid.onCellPrepared.subscribe((e) => {
            this.treeListOnCellPrepared(e);
        });

        this.dataSourceChangeSubscription = this.grid.dataSourceChange.subscribe((ds) => {
            this.dataSource = ds;
        });

        // Treelist - Default Configs
        /************************************ TREELIST DEFAULT CONFIG**************************************************/

        this.grid.editing.texts = Object.assign(this.grid.editing.texts, {
            saveRowChanges: 'Aplicar'
        });

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

        // TreeList editing allow alldx-treelist-header-panel
        this.grid.editing.allowAdding = true;
        this.grid.editing.allowUpdating = true;
        this.grid.editing.allowDeleting = true;

        // TreeList popup editing - default position - default config if popup
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


        this.grid.columnAutoWidth = this.columnAutoWidth;
        this.grid.wordWrapEnabled = this.wordWrapEnabled;
        this.grid.showBorders = this.showBorders;
        this.grid.showRowLines = this.showRowLines;
        this.grid.showColumnLines = this.showColumnLines;
        this.grid.autoExpandAll = this.autoExpandAll;

        // TreeList allow all column resizing by default
        this.grid.allowColumnResizing = true;


        // Paging / Pager / Selection config by default
        if (!this.hasCustomPagingConf) {
            this.grid.paging = {
                enabled: false
            };

            this.grid.pager = {
                showPageSizeSelector: false
            };
        }

        if (!this.hasCustomSelectionConf) {
            this.grid.selection = {
                mode: 'single',
            }
        }

    }

    runOnAfterRowValidated(data: any, isNewRecord: boolean) {
        if (this.reorder && isNewRecord) {
            const sequencial = this.getNextSequencial(data);
            data[this.reorderProperty] = sequencial;
        }
    }

    moveRowUp() {
        if (this.canReorderRow()) {
            const selected = this.getGridInstance().getSelectedRowsData()[0];
            const selectedIndex = (this.grid.dataSource as any[]).indexOf(selected);
            const parentIdExpr = this.getParentIdExpr();

            if (parentIdExpr) {
                let sameLevel = this.dataSource.filter(recurso => recurso != selected &&
                    _.get(recurso, parentIdExpr) === _.get(selected, parentIdExpr) &&
                    recurso[this.reorderProperty] < selected[this.reorderProperty]
                );
                if (sameLevel) {
                    const target = this.getRecursoBySequencial(sameLevel, (selected[this.reorderProperty] - 1));
                    if (target) {
                        const targetIndex = (this.grid.dataSource as any[]).indexOf(target);
                        this.moveObjectGrid(selectedIndex, selected, targetIndex, target);
                    }
                }
            }
        }
    }

    moveRowDown() {
        if (this.canReorderRow()) {
            const selected = this.getGridInstance().getSelectedRowsData()[0];
            const selectedIndex = (this.grid.dataSource as any[]).indexOf(selected);
            const parentIdExpr = this.getParentIdExpr();

            if (parentIdExpr) {
                let sameLevel = this.dataSource.filter(recurso => recurso != selected &&
                    _.get(recurso, parentIdExpr) === _.get(selected, parentIdExpr) &&
                    recurso[this.reorderProperty] > selected[this.reorderProperty]
                );
                if (sameLevel) {
                    const target = this.getRecursoBySequencial(sameLevel, (selected[this.reorderProperty] + 1));
                    if (target) {
                        const targetIndex = (this.grid.dataSource as any[]).indexOf(target);
                        this.moveObjectGrid(selectedIndex, selected, targetIndex, target);
                    }
                }
            }
        }
    }

    protected reorderAfterRowRemoved() {
        if (!_.isEmpty(this.dataSource)) {
            const roots = this.dataSource.filter(data => !_.get(data, this.getParentIdExpr())); //roots w/ parent
            roots.forEach(root => {
                this.reorderSequencial(root)
            });
        }
    }

    private reorderSequencial(object) {
        const sameLevel = this.getDataFromSameLevel(object);
        sameLevel.forEach((data, idx) => {
            data[this.reorderProperty] = idx + 1;
            const childrens = this.getChildrens(data);
            if (!_.isEmpty(childrens)) {
                childrens.forEach(child => this.reorderSequencial(child));
            }
        });
    }

    private getNextSequencial(object): number {
        const sameLevel = this.getDataFromSameLevel(object);
        if (!_.isEmpty(sameLevel)) {
            return Math.max.apply(Math, sameLevel.map(o => o[this.reorderProperty] ? o[this.reorderProperty] : 0)) + 1;
        }
        return 1;
    }

    private getDataFromSameLevel(object) {
        const parentIdExpr = this.getParentIdExpr();
        return !_.isEmpty(this.dataSource) ? this.dataSource.filter(data =>
            _.get(data, parentIdExpr) === _.get(object, parentIdExpr)
        ) : [];
    }

    private getChildrens(object) {
        const parentIdExpr = this.getParentIdExpr();
        return !_.isEmpty(this.dataSource) ? this.dataSource.filter(data =>
            _.get(data, parentIdExpr) == object.id
        ) : [];
    }

    private getRecursoBySequencial(recursos: any[], sequencial: number) {
        return recursos.filter(recurso => recurso[this.reorderProperty] === sequencial)[0];
    }

    initializeSaveRowsEnterKey(event: any) {
        event.component.registerKeyHandler("enter", key => this.saveChanges(key));
    }

    initializeCancelEditEnterKey(event: any) {
        event.component.registerKeyHandler("enter", key => this.cancelEdit(key));
    }

    private treeListOnCellPrepared(event) {
        if (event.rowType === "data" && event.column.command === "edit") {

            let isEditing = event.row.isEditing, cellElement = event.cellElement;

            if (isEditing) {

                let deleteLink = cellElement.querySelector(".dx-link-delete"),
                    saveLink = cellElement.querySelector(".dx-link-save"),
                    canceLink = cellElement.querySelector(".dx-link-cancel");

                if (deleteLink) {
                    deleteLink.style.display = 'inline-block';
                    deleteLink.classList.add("dx-icon-trash");
                    deleteLink.textContent = "";
                }

                if (saveLink) {
                    saveLink.style.display = 'inline-block';
                    saveLink.classList.add("dx-icon-save");
                    saveLink.textContent = "";
                }

                if (canceLink) {
                    canceLink.style.display = 'inline-block';
                    canceLink.classList.add("dx-icon-undo");
                    canceLink.textContent = "";
                }


            } else {
                let addLink = cellElement.querySelector(".dx-link-add"),
                    editLink = cellElement.querySelector(".dx-link-edit"),
                    undo = cellElement.querySelector(".dx-link-undelete"),
                    deleteLink = cellElement.querySelector(".dx-link-delete");

                if (undo) {
                    undo.style.display = 'inline-block';
                    undo.classList.add("dx-icon-undo");
                    undo.textContent = "";

                }
                if (addLink) {
                    addLink.style.display = 'inline-block';
                    addLink.classList.add("dx-icon-add");
                    addLink.textContent = "";
                }

                if (deleteLink) {
                    deleteLink.style.display = 'inline-block';
                    deleteLink.classList.add("dx-icon-trash");
                    deleteLink.textContent = "";
                }

                if (editLink) {
                    editLink.style.display = 'inline-block';
                    editLink.classList.add("dx-icon-edit");
                    editLink.textContent = "";
                }
            }
        }

        if (this.onCellPrepared) {
            this.onCellPrepared(event);
        }
    }

    private treeListOnContentReady(event: any) {
        event.component.columnOption("command:edit", "fixed", true);

        // Habilita os botões quando o modo for 'batch'
        if (this.grid.editing && this.grid.editing.mode == 'batch') {
            this.showButtonSaveRow = true;
            this.showButtonCancelEdit = true;
            this.showButtonRemoveSelectedRows = false;
        }

        const element = this.domHandler.jQuery(".dx-treelist-header-panel");
        if (element) {
            element.remove();
        }

        if (this.onContentReady) {
            this.onContentReady(event);
        }
    }

    protected gridOnDestroy() {
        if (this.contentReadySubscription) {
            this.contentReadySubscription.unsubscribe();
        }

        if (this.cellPreparedSubscription) {
            this.cellPreparedSubscription.unsubscribe();
        }

    }

}
