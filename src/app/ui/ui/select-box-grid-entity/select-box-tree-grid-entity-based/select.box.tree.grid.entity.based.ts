import {Component, Injector, Input, ViewChild} from "@angular/core";
import {DxTreeListComponent, DxTreeViewComponent} from "devextreme-angular";
import {SelectBoxAbstractGridEntity} from "../select-box-grid-entity/select.box.abstract.grid.entity";

@Component({
    selector: "select-box-tree-grid-entity-based",
    template: `
        
        <dx-drop-down-box
                [value]="value"
                [disabled]="disabled"
                [readOnly]="readOnly"
                [displayExpr]="displayExpr"
                [placeholder]="placeholder"
                [showClearButton]="showClearButton"
                [dataSource]="dataSource"
                [visible]="visible"
                [focusStateEnabled]="true"
                [tabIndex]="tabIndex"
                [width]="width"
                [height]="height"
                (onOpened)="onOpened($event)">

            <div *dxTemplate="let data of 'content'">
                <dx-tree-list #tree
                              [parentIdExpr]="parentKey"
                              [wordWrapEnabled]="false"
                              [showBorders]="true"
                              [showRowLines]="true"
                              [showColumnLines]="true"
                              [autoExpandAll]="true"
                              [width]="gridWidth"
                              [height]="gridHeight">
                    
                    <dxo-scrolling mode="standard"></dxo-scrolling>
                </dx-tree-list>
            </div>

            <div *dxTemplate="let data of 'item'">
                <div class="ellipsis-content" title="{{data ? data.getDisplayValue() : null}}">{{data ? data.getDisplayValue() : null}}</div>
            </div>

            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>

        </dx-drop-down-box>
        
    `
})
export class SelectBoxTreeGridEntityBased extends SelectBoxAbstractGridEntity {

    constructor(injector: Injector) {
        super(injector);
    }

    @ViewChild("tree") treeView: DxTreeListComponent;

    protected grid(): DxTreeListComponent {
        return this.treeView;
    }

    @Input() gridWidth: string = "100%";
    @Input() gridHeight: string = "100%";

    @ViewChild("tree") tree: DxTreeListComponent
    @Input() parentKey: string;


    protected onKeyPress(event) {
        this.onKey(event, 'ArrowLeft', () => {
            this.tree.instance.collapseRow(this.getKeySelectedRow());
        })

        this.onKey(event, 'ArrowRight', () => {
            this.tree.instance.expandRow(this.getKeySelectedRow());
        })
    }

}

