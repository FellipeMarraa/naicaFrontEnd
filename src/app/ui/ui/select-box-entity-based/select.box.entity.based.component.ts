import {Component, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {DxSelectBoxComponent} from "devextreme-angular";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {SonnerBaseEntity} from "../../core/commons/classes/sonner.base.entity";
import * as _ from "lodash";

@Component({
    selector: "select-box-entity-based",
    template: `
        <dx-select-box #selectBox
                       [readOnly]="readOnly"
                       [visible]="visible"
                       [disabled]="disabled"
                       [dataSource]="items"
                       [displayExpr]="displayExpr"
                       [(value)]="selectedItem"
                       (valueChange)="ItemChange($event)"
                       [placeholder]="placeholder" 
                       (onValueChanged)="onValueChanged.emit($event)"
                       [width]="width"
                       [showClearButton]="showClearButton"
                       [searchEnabled]="searchEnabled">
            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>
        </dx-select-box>
    `
})
export class SelectBoxEntityBasedComponent extends BaseComponent {

    constructor(private objectUtilsService: ObjectUtilsService,
                private injector: Injector) {
        super(injector);
    }

    @ViewChild("selectBox", { static: true }) selectBox: DxSelectBoxComponent;

    private _items: SonnerBaseEntity[] = [];

    private _selectedItem: SonnerBaseEntity;

    get selectedItem(): SonnerBaseEntity {
        return this._selectedItem;
    }

    // --- Este Input deve estar sempre na primeira posicao
    @Input()
    keyExp: string = "id";

    @Input()
    displayExpr: Function | string = "getDisplayValue";

    @Input()
    itemTemplate: string;

    @Input()
    get items(): SonnerBaseEntity[] {
        return this._items;
    }

    set items(value: SonnerBaseEntity[]) {
        this._items = value;
        this.selectedItem = this.getReferenceOnDataSource(this._selectedItem);
    }

    @Input()
    set selectedItem(value: SonnerBaseEntity) {

        if(this.selectedItem != value) {

            if (!value || (!value.getId() && !(_.isFunction(_.get(value, this.keyExp)) ? _.get(value, this.keyExp)() : _.get(value, this.keyExp)))) {
                this._selectedItem = null;
                return;
            }

            this._selectedItem = this.getReferenceOnDataSource(value);
            this.selectedItemChange.emit(value);
        }
    }

    private _selectFirst = false;

    get selectFirst(): any {
        return this._selectFirst;
    }

    @Input()
    set selectFirst(value: any) {
        this._selectFirst = value;
        if (value) {
            this.doSelectFist();
        }
    }

    @Input()
    set selectByIndex(index : number){
        if (!this.objectUtilsService.isEmpty(this._items)) {
            this.selectedItem = this._items[index];
        }
    }

    @Input()
    validationGroup: string;

    @Input()
    showClearButton: boolean;

    @Input()
    visible: boolean = true;

    @Input()
    disabled: boolean = false;

    @Input()
    readOnly: boolean = false;

    @Input()
    sortByString: boolean = true;

    @Input()
    width: string | number = "100%";

    @Input()
    placeholder: string = 'Selecione...';

    @Input()
    searchEnabled: boolean = true;

    @Output()
    selectedItemChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onValueChanged: EventEmitter<any> = new EventEmitter<any>()

    clearSelectedItem() {
        this.selectedItem = null;
    }

    doSelectFist() {
        if (!this.objectUtilsService.isEmpty(this._items)) {
            this.selectedItem = this._items[0];
        }
    }

    doAfterViewInit() {
        if (this.selectFirst) {
            this.doSelectFist();
        }
    }

    public focus() {
        this.selectBox.instance.focus();
    }

    private getReferenceOnDataSource(value: SonnerBaseEntity): SonnerBaseEntity {
        if (value && !_.isEmpty(this.items)) {
            for (let obj of this.items) {
                if (this.objectUtilsService.isEqual(obj, value, this.keyExp)) {
                    return obj;
                }
            }
        }
        return value;
    }

    ItemChange(event: any) {
        this.selectedItemChange.emit(event);
    }
}
