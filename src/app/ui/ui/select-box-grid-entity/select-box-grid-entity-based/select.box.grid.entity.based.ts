import {Component, Injector, Input, ViewChild} from "@angular/core";
import {DxDataGridComponent} from "devextreme-angular";
import {SelectBoxAbstractGridEntity} from "../select-box-grid-entity/select.box.abstract.grid.entity";

@Component({
    selector: "select-box-grid-entity-based",
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
                (valueChange)="onValueChanged($event)"
                [width]="width"
                [height]="height"
                (onOpened)="onOpened($event)">

            <div *dxTemplate="let data of 'content'">
                <dx-data-grid #grid [selection]="{mode: 'none'}" [width]="gridWidth" [height]="gridHeight"></dx-data-grid>
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
export class SelectBoxGridEntityBased extends SelectBoxAbstractGridEntity {

    constructor(injector: Injector) {
        super(injector);
    }

    @ViewChild("grid") dataGrid: DxDataGridComponent;

    protected grid(): DxDataGridComponent {
        return this.dataGrid;
    }

    @Input() gridWidth: string = "100%";
    @Input() gridHeight: string = "400px";

}
