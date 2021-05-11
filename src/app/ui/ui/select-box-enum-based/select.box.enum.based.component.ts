import {Component, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {EnumUtils} from "../../app/classes/enum.utils";
import {BaseComponent} from "../base-component/base.component";
import {DxSelectBoxComponent} from "devextreme-angular";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";

@Component({
    selector: "select-box-enum-based",
    template: `
        <dx-select-box #selectBox
                       [readOnly]="readOnly"
                       [visible]="visibled"
                       [tabIndex]="tabIndex"
                       [disabled]="disabled"
                       [displayExpr]="displayFunction"
                       [items]="items"
                       [value]="selectedItem"
                       (onSelectionChanged)="valorSelecionado($event)"
                       [placeholder]="placeholder"
                       [width]="width"
                       [showClearButton]="showClearButton"
                       [hoverStateEnabled]="hoverStateEnabled"
                       [searchEnabled]="searchEnabled">

            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>

        </dx-select-box>`
})
export class SelectBoxEnumBasedComponent extends BaseComponent {

    constructor(private objectUtilsService: ObjectUtilsService,
                private injector: Injector) {
        super(injector);
        this.valorSelecionado = this.valorSelecionado.bind(this);
    }

    @ViewChild("selectBox", {static: true}) selectBox: DxSelectBoxComponent;

    @Input()
    items: any[];

    private _selectedItem: any;

    get selectedItem(): any {
        return this._selectedItem;
    }

    @Input()
    set selectedItem(value: any) {
        if (this._selectedItem != value) {
            this._selectedItem = value;
            this.selectedItemChange.emit(value);
        }
    }

    private _selectFirst = false;

    get selectFirst(): boolean {
        return this._selectFirst;
    }

    @Input()
    set selectFirst(value: boolean) {
        this._selectFirst = value;
    }

    @Input()
    itemDefault: any;

    @Input()
    validationGroup: string;

    @Input()
    showClearButton: boolean;

    @Input()
    hoverStateEnabled: boolean;

    @Input()
    visibled: boolean = true;

    @Input()
    disabled: boolean = false;

    @Input()
    readOnly: boolean = false;

    @Input()
    tabIndex: number;

    @Output()
    onSelectionChanged: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    displayFunction: Function | string = (enumValue) => enumValue;


    private _sortByString: boolean = true;

    get sortByString(): boolean {
        return this._sortByString;
    }

    @Input()
    set sortByString(value: boolean) {
        this._sortByString = value;
    }

    @Input()
    width: string = "100%";

    @Input()
    placeholder: string = 'Selecione...';

    @Input()
    searchEnabled: boolean = true;

    @Input()
    set type(value: any) {
        this._type = value;
        this.loadItems();
    }

    @Output()
    selectedItemChange: EventEmitter<any> = new EventEmitter<any>();

    get type(): any {
        return this._type;
    }

    private _type: any;

    clearSelectedItem() {
        this.selectedItem = null;
    }

    loadItems() {
        if (this.type) {
            if (!this.items) {
                this.items = EnumUtils.values(this.type);
                if (this.sortByString) {
                    this.items = this.items.sort();
                }
            }
        }
    }

    doAfterViewInit() {
        if (!this.objectUtilsService.isEmpty(this.items)) {
            if (this.itemDefault) {
                this.selectedItem = this.itemDefault;
            }
            // **************************** VERIFICAR ***********************************************************************************************
            // ********** o Clico de vida do componente depende de diversos fatores ("Se ele foi criado através de um template, em grid, etc...")
            // ********** com isso, toda vez que ele é instanciado no DOM, o componente segue seu ciclo, e o doAfterViewInit é executado...
            // ********** Neste caso, quando value era setado, BaseComponent invocava o ngAfterViewInit que por sua vez
            // ********** invocava o doAfterViewInit das classes que o implementam(esse ,et[odo é um exemplo), com isso o value/item sempre era alterado para o item[0] do array! ******
            // else {
            //     this.selectedItem = this.items[0];
            // }
        }
    }

    valorSelecionado(event: any) {

        let data = null;
        if (event && event.selectedItem) {
            data = event.selectedItem;

            if (this.items && !this.items.some(i => i == data)) {
                throw `Valor inválido: ${data}. Valor não encontrado no dataSource.`;
            }
        }

        this.selectedItem = data;

        this.onSelectionChanged.emit(event);
    }

    public focus() {
        this.selectBox.instance.focus();
    }

}
