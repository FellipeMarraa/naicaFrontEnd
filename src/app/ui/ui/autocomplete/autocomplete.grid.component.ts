import {debounceTime} from 'rxjs/operators';
import {Component, ContentChild, EventEmitter, Injector, Input, Output, ViewChild} from "@angular/core";
import {Subject, Subscription} from "rxjs";
import {DxDataGridComponent, DxTextBoxComponent, DxValidatorComponent} from "devextreme-angular";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import {DomHandler} from "../../app/services/dom.handler";
import {BaseComponent} from "../base-component/base.component";
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";

let idGen = 0;

@Component({
    selector: 'autocomplete-grid',
    template: `

        <div>
            <dx-text-box #textBox
                         [tabIndex]="0"
                         [id]="textFieldId"
                         [visible]="visible"
                         [placeholder]="placeholder"
                         [showClearButton]="showClearButton"
                         [readOnly]="readOnly"
                         [width]="inputWidth"
                         [disabled]="disabled"
                         [mask]="mask"
                         [value]="query"
                         (onKeyUp)="onQueryChange($event)"
                         (onValueChanged)="onQueryChange($event)"
                         (onKeyDown)="onKeyDown($event)">
                <dx-validator #validatorAutoComplete [validationGroup]="validationGroup">
                    <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
                </dx-validator>
            </dx-text-box>

            <dx-popup [showTitle]="false" [(visible)]="opened" [dragEnabled]="false" [focusStateEnabled]="false"
                      [shading]="false" [closeOnOutsideClick]="true"
                      [position]="{my: 'left top', at: 'left bottom', of: '#' + textFieldId}" [width]="calcPopupWidth"
                      [height]="popupHeight"
                      (onShown)="onPopupVisible($event)">

                <div *dxTemplate="let data of 'content'">
                    <ng-content select="dx-data-grid"></ng-content>
                </div>
            </dx-popup>
        </div>
    `
})
export class AutocompleteGridComponent extends BaseComponent {


    @Input()
    visible: boolean = true;

    textFieldId: string = `autocompleteTextField-${idGen++}`;

    @Input()
    opened: boolean = false;

    @ViewChild("textBox", {static: true})
    textBox: DxTextBoxComponent;

    @ViewChild("validatorAutoComplete", {static: true})
    validator: DxValidatorComponent;

    @Input()
    disabled: boolean;

    @Input()
    readOnly: boolean;

    @Input()
    showClearButton: boolean = true;

    @ContentChild(DxDataGridComponent, {static: true})
    dataGrid: DxDataGridComponent;

    @Input()
    popupWidth: number;

    @Input()
    popupHeight: number = 400;

    @Input()
    valueProp: string = "id";

    @Input()
    displayProp: string;

    // Valor em Milesegundos que define um período entre as emissoes da fonte observável.
    @Input()
    debounceTime: number = 500;

    @Input()
    placeholder: string;

    @Input()
    inputWidth: number;

    @Input()
    mask: string;

    @Input()
    newType: Function;

    @Input()
    confirmNewTypeMessage: string;

    @Input()
    newTypeQueryProp: string;

    @Input()
    queryProp: string;

    @Input()
    selectedFirstByDefault: boolean = true;

    @Input()
    upperCase: boolean = false;

    private _query: string;

    get query(): string {
        return this._query;
    }

    set query(value: string) {
        this._query = value;
    }

    private _value: any;

    get value() {
        return this._value;
    }

    @Input()
    set value(value) {
        if (!this.objectUtils.isEqual(this._value, value) &&
            (!value || !this._value || !value.id || !this._value.id ||
                this._getDisplayProp(value) !== this._getDisplayProp(this._value))) {

            if (value) {
                this._value = value;
                if (this.queryProp) {
                    this._query = value[this.queryProp];
                } else {
                    this._query = this._getDisplayProp(value);
                }
            } else {
                this._value = null;
                this._query = "";
                if (this.dataGrid) {
                    this.dataGrid.selectedRowKeys = [];
                }
            }

            setTimeout(() => this.cursorSelectionEnd());
        }
    }

    private _notifyValue() {
        this.valueChange.emit(this._value);
    }

    private selectedRow: number = null;

    private mapItems: Map<any, any> = new Map();

    private _items: any;

    get items() {
        return this._items;
    }

    @Input()
    set items(value) {
        if (this._items != value) {
            this._items = value;

            if (this.dataGrid) {
                if (this.opened) {
                    this.dataGrid.dataSource = value;
                } else {
                    this.dataGrid.dataSource = [];
                }
                if (this.dataGrid.instance && !!this.dataGrid.instance.deselectAll) {
                    this.dataGrid.instance.deselectAll();
                }
                this.selectedRow = null;
            }

            this.mapItems = new Map();
            if ((value && value.length > 0 && this.query && this.query != "")) {
                value.forEach(item => this.mapItems.set(item[this.valueProp], item));
                this.opened = true;
            } else {
                this.opened = false;
            }
        }

        this.selectFirstElementGrid();
    }

    @Output()
    onQueryChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    valueChange: EventEmitter<any> = new EventEmitter<any>();

    private querySubject: Subject<string> = new Subject<string>();

    private keyUpSubscription: Subscription;

    private gridContentReadySubscription: Subscription;

    private confirmDialogVisible: boolean = false;

    constructor(private messageBoxService: MessageBoxUiService,
                private domHandler: DomHandler,
                private objectUtils: ObjectUtilsService,
                private injector: Injector) {
        super(injector);
        this.calcPopupWidth = this.calcPopupWidth.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onPopupVisible = this.onPopupVisible.bind(this);
    }

    doOnInit(): void {
        this.keyUpSubscription = this.querySubject
            .pipe(
                debounceTime(this.debounceTime)
            )
            .subscribe(value => {
                this.onQueryChanged.emit(value);
            });
    }

    getCurrentQuery(): string {
        return this.textBox.value;
    }

    /**
     * Seleciona o primeiro elemento da lista
     */
    selectFirstElementGrid() {
        if (this.selectedFirstByDefault) {
            this.selectedRow = 0;
            this._selectRowIndex(this.selectedRow);
        }
    }

    doAfterContentInit(): void {

        if (!this.dataGrid) {
            this.messageBoxService.showError("DataGrid não encontrado!");
            return;
        }

        if (this._items) {
            this.dataGrid.dataSource = this._items;
        }

        //this.dataGrid.rowAlternationEnabled = true;
        this.dataGrid.hoverStateEnabled = true;

        this.dataGrid.selection = {mode: 'single'};

        const $ = this.domHandler.jQuery;

        this.dataGrid.onRowPrepared.subscribe(row => {
            if (row.rowType != "header") {
                let that = this;
                $(row.rowElement).click(function (e) {
                    setTimeout(() => {
                        that.value = row.data;
                        that._notifyValue();
                        that.opened = false;
                    });
                });
            }
        });

        this.dataGrid.onSelectionChanged.subscribe(options => {
            let scrollable = options.component.getView('rowsView')._scrollable;
            let selectedRowElements = this.domHandler.jQuery(this.dataGrid.instance.element()).find('tr.dx-selection');
            if (scrollable) {
                scrollable.scrollToElement(selectedRowElements[0]);
            }
        });

    }

    doOnDestroy(): void {
        if (this.keyUpSubscription) {
            this.keyUpSubscription.unsubscribe();
        }

        if (this.gridContentReadySubscription) {
            this.gridContentReadySubscription.unsubscribe();
        }
    }

    calcPopupWidth() {

        if (this.popupWidth) {
            return this.popupWidth;
        }

        let elem = this.domHandler.jQuery(this.textBox.instance.element());
        return elem.width();

    }

    onPopupVisible(event) {

        // seleciona o primeiro elemento, quando popup estiver visível
        this.selectFirstElementGrid();

        if (this.dataGrid) {
            this.dataGrid.height = this.popupHeight; // - 25;
            this.dataGrid.width = this.calcPopupWidth(); // - 35;
            this.dataGrid.dataSource = this._items;
        }
    }


    onKeyDown(event: any) {

        if (this.confirmDialogVisible) {
            return;
        }

        let q = event.component && event.component['_value'] ? event.component['_value'] :
            this.domHandler.jQuery(this.textBox.instance.element()).find('input').val();

        if (event && event.event && event.event.key == 'Escape') {
            if (event.event.key == 'Escape' || (!this.newType && !this.newTypeQueryProp)) {
                if (this.value) {
                    this._query = this._getDisplayProp(this.value);

                } else {

                    this._query = "";
                }
            } else if (this.newType && this.newTypeQueryProp) {
                this.createNewValue(q);

            }
            this.opened = false;
            this.dataGrid.dataSource = [];
            return;
        }

        if (event && event.event && q && q != "" && (event.event.key == 'Tab' || event.event.key == 'Enter')) {
            // event.event.preventDefault();
            if (this.opened && this.selectedRow !== null) {
                setTimeout(() => {
                    this.value = this._items[this.selectedRow];
                    this._notifyValue();
                    this.opened = false;
                });
            } else if (!this.selectedRow && this.newType && this.newTypeQueryProp) {
                if (this._value && this._value[this.newTypeQueryProp] === q) {
                    return;
                }
                if (this.confirmNewTypeMessage) {
                    this.confirmDialogVisible = true;
                    this.messageBoxService.confirm(this.confirmNewTypeMessage, "Novo Registro").then(resp => {
                        if (resp) {
                            setTimeout(() => {
                                this.createNewValue(q);
                                this.opened = false;
                            });
                        }
                    });
                } else {
                    setTimeout(() => {
                        this.createNewValue(q);
                        this.opened = false;
                    });
                }
            }
            return;
        }

        if (event && event.event && event.event.key == 'ArrowDown' && q && q != "" && this.opened) {
            event.event.preventDefault();
            if (!this._items || this._items.length == 0) {
                this.selectedRow = null;
            } else if (this.selectedRow === null || this.selectedRow >= this._items.length - 1) {
                this.selectedRow = 0;
            } else {
                this.selectedRow = this.selectedRow + 1;
            }

            if (this.selectedRow !== null) {
                this._selectRowIndex(this.selectedRow);
            } else {
                this.dataGrid.instance.deselectAll();
            }
            return;
        }

        if (event && event.event && event.event.key == 'ArrowUp' && q && q != "" && this.opened) {
            event.event.preventDefault();
            if (!this._items || this._items.length == 0) {
                this.selectedRow = null;
            } else if (this.selectedRow === null || this.selectedRow === 0) {
                this.selectedRow = this._items.length - 1;
            } else {
                this.selectedRow = this.selectedRow - 1;
            }

            if (this.selectedRow !== null) {
                this._selectRowIndex(this.selectedRow);
            } else {
                this.dataGrid.instance.deselectAll();
            }
            return;
        }
    }

    private createNewValue(q) {
        let newSelected = new (this.newType as any)();
        newSelected[this.newTypeQueryProp] = q;
        this.value = newSelected;
        this._notifyValue();
    }

    onQueryChange(event: any) {

        if (event && event.event && (event.event.key == 'Escape' || event.event.key == 'Tab')) {
            return;
        }

        if (event && event.event && event.event.key == 'Enter') {
            if (this.confirmDialogVisible) {
                this.confirmDialogVisible = false;
                return;
            }
            if (this.selectedRow !== null) {
                this.value = this._items[this.selectedRow];
                this._notifyValue();
                this.opened = false;
            }
            return;
        }

        let q = event.component && event.component['_value'] ? event.component['_value'] :
            this.domHandler.jQuery(this.textBox.instance.element()).find('input').val();

        if (q) {
            q = q.trim();
            if (this.upperCase) {
                q = q.toUpperCase();
            }
        }

        let lastQuery = this._query ? this._query.trim() : null;

        if (q == lastQuery) {
            return;
        }

        this._query = q;

        if (q == null || q == "") {
            this.opened = false;
            this.value = null;
            this._notifyValue();
        } else {
            this.querySubject.next(q);
        }
    }

    private _selectRowIndex(absoluteRowIndex) {
        if (absoluteRowIndex >= 0) {
            let gridInstance = this.dataGrid.instance;
            if (gridInstance) {
                let pgSize = gridInstance.pageSize();
                let pageIndex = Math.floor(absoluteRowIndex / pgSize);
                let visibleRowIndex = absoluteRowIndex - (pageIndex * pgSize);
                if (pageIndex !== gridInstance.pageIndex()) {
                    gridInstance.pageIndex(pageIndex);
                }
                setTimeout(() => gridInstance.selectRowsByIndexes([visibleRowIndex]), 100);
            }
        }
    }

    private _getDisplayProp(origem: any): string {

        if (this.displayProp) {

            let prop = origem[this.displayProp];
            if (prop instanceof Function) {
                prop = prop.bind(origem);
                return prop();
            } else {
                if (prop) {
                    return prop.toString();
                } else {
                    return "";
                }
            }
        }

        return origem.toString();
    }

    getValidator(): DxValidatorComponent {
        return this.validator;
    }

    cursorSelectionEnd() {
        if (!this.mask) {
            return;
        }
        let element = this.textBox.instance.element().getElementsByClassName("dx-texteditor-input");
        const maskedText: string = this.textBox.text;
        const maskedChar: string = this.textBox.maskChar;
        if (maskedText && maskedChar) {
            let focusIndex: number = maskedText.indexOf(maskedChar);
            if (focusIndex >= 0) {
                this.textBox.instance.focus();
                setTimeout(() => {
                    this.domHandler.setSelectionRange(element, focusIndex, focusIndex);
                });
            }
        }
    }
}
