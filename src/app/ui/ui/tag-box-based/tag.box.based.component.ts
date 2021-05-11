import {Component, EventEmitter, Injector, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {EnumUtils} from "../../app/classes/enum.utils";
import {BaseComponent} from "../base-component/base.component";
import * as _ from 'lodash';
import {DxTagBoxComponent} from "devextreme-angular";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {GuardaMunicipalUnidade} from "../../guardamunicipal/classes/guarda.municipal.unidade";
import {SonnerBaseEntity} from "../../core/commons/classes/sonner.base.entity";

@Component({
    selector: "tag-box-based",
    template: `
        <dx-tag-box #tagBox
                    [hideSelectedItems]="hideSelectedItems"
                    [maxDisplayedTags]="maxDisplayedTags"
                    [itemTemplate]="'itemTemplate'"
                    [searchExpr]="searchExpr"
                    [readOnly]="readOnly"
                    [showSelectionControls]="showSelectionControls"
                    [width]="width"
                    [items]="items"
                    [searchEnabled]="searchEnabled"
                    [showClearButton]="showClearButton"
                    [placeholder]="placeholder"
                    [disabled]="disabled"
                    [displayExpr]="displayValue"
                    [visible]="visible"
                    [applyValueMode]="'instantly'"
                    [selectAllMode]="'page'"
                    [(value)]="selectedItems"
                    (onSelectionChanged)="onEntidadeSelecionada($event)">
            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>

            <div *dxTemplate="let item of 'itemTemplate'">
                <ng-container *ngIf="!itemTemplate">{{item.getDisplayValue()}}</ng-container>
                <ng-container *ngIf="itemTemplate">
                    <ng-container *ngTemplateOutlet="itemTemplate;context:{item: item}"></ng-container>
                </ng-container>
            </div>
        </dx-tag-box>
    `
})
export class TagBoxBasedComponent extends BaseComponent {

    private _items: SonnerBaseEntity[];

    @Input()
    itemTemplate: TemplateRef<any>;

    @Input()
    set items(items: SonnerBaseEntity[]){
        if (this._items != items) {
            this._items = items;
            this.applyOnDataSource();
        }
    }

    get items() : SonnerBaseEntity[] {
        return this._items;
    }

    private _value: SonnerBaseEntity[];

    @Input()
    get selectedItems(): SonnerBaseEntity[] {
        return this._value;
    }

    set selectedItems(value: SonnerBaseEntity[]) {
        if (this._value != value) {
            this._value = value;
            this.applyOnDataSource();
            this.selectedItemsChange.emit(this._value);
        }
    }

    @Input()
    placeholder: string;

    @Input()
    disabled: boolean;

    @Input()
    hideSelectedItems: boolean = false;

    @Input()
    maxDisplayedTags: number = 3;

    @Input()
    showSelectionControls: boolean = true;

    @Input()
    searchEnabled: boolean = false;

    @Input()
    searchExpr: any;

    @Input()
    width: number;

    @Input()
    ativo: boolean = true;

    @Input()
    readOnly: boolean = false;

    @Input()
    showClearButton: boolean = true;

    @Output()
    selectedItemsChange: EventEmitter<SonnerBaseEntity[]> = new EventEmitter<SonnerBaseEntity[]>();

    @Output()
    onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    visible: boolean = true;

    constructor(injector: Injector, private objectUtils: ObjectUtilsService) {
        super(injector);
    }

    ngAfterViewInit(): void {
    }

    applyOnDataSource() {
        if (!this._.isEmpty(this.items) && !this._.isEmpty(this._value)) {
            for (let i = 0; i < this._value.length; i++) {
                for (let obj of this.items) {
                    if (this.objectUtils.isEqual(obj, this._value[i])) {
                        this._value[i] = obj;
                        break;
                    }
                }
            }
        }
    }

    onEntidadeSelecionada(event: any) {
        this.onSelectionChanged.emit(event);
    }

}
