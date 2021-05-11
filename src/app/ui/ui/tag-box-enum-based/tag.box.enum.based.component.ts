import {Component, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {EnumUtils} from "../../app/classes/enum.utils";
import {BaseComponent} from "../base-component/base.component";
import * as _ from 'lodash';
import {DxTagBoxComponent} from "devextreme-angular";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";

@Component({
    selector: "tag-box-enum-based",
    template: `
    <dx-tag-box #tagBox 
                [width]="width" 
                [items]="items"
                [showSelectionControls]="true" 
                [showDropDownButton]="true"
                [searchEnabled]="searchEnabled"
                [showClearButton]="showClearButton"
                [placeholder]="placeholder"
                [disabled]="disabled"
                [visible]="visibled"
                [applyValueMode]="'instantly'"
                [selectAllMode]="'page'"
                [value]="selectedItems"
                (valueChange)="onSelectionChanged($event)">
        <dx-validator [validationGroup]="validationGroup">
            <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
        </dx-validator>
    </dx-tag-box>
`
})
export class TagBoxEnumBasedComponent extends BaseComponent {

    constructor(private objectUtilsService: ObjectUtilsService,
                private injector: Injector) {
        super(injector);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    filter:any;

    @ViewChild("tagBox") tagBox: DxTagBoxComponent;

    private _selectedItems: any;
    private _type: any;


    @Input()
    items: any[];

    @Input()
    validationGroup: string;

    @Input()
    showClearButton: boolean;

    @Input()
    visibled: boolean = true;

    @Input()
    disabled: boolean = false;

    @Input()
    sortByString: boolean = false;

    @Input()
    width: string = "100%";

    @Input()
    placeholder: string = 'Selecione...';

    @Input()
    searchEnabled: boolean = false;

    @Input()
    set type(value: any) {
        this._type = value;
        this.loadItems();
    }
    get type(): any {
        return this._type;
    }

    @Input()
    set selectedItems(value: any) {
        if (this._selectedItems != value) {
            this._selectedItems = value;
            this.selectedItemsChange.emit(value);
        }
    }
    get selectedItems(): any {
        return this._selectedItems;
    }


    @Output()
    selectedItemsChange: EventEmitter<any> = new EventEmitter<any>();

    clearSelectedItems() {
        this.selectedItems = null;
    }


    loadItems() {
        if (this.type) {
            if (_.isEmpty(this.items)) {
                this.items = EnumUtils.values(this.type);
                if (this.sortByString) {
                    this.items = this.items.sort();
                }
            }
        }
    }


    onSelectionChanged(event: any) {
        this.selectedItems = event;
    }

    public focus() {
        this.tagBox.instance.focus();
    }

}
