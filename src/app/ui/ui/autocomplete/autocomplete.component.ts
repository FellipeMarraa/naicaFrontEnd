import {debounceTime} from 'rxjs/operators';
import {Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {Subscription, Subject} from "rxjs";
import {DxAutocompleteComponent} from "devextreme-angular";
import * as _ from "lodash";
import {BaseComponent} from "../base-component/base.component";

@Component({
    selector: 'autocomplete',
    template: `
        <dx-autocomplete #editor [placeholder]="placeholder" [dataSource]="items" (onKeyUp)="onKeyUp($event)"
                         [searchExpr]="searchExpr"
                         [readOnly]="readOnly"
                         [width]="width" [height]="height" [valueExpr]="valueExpr"
                         [(value)]="selected"
                         (onItemClick)="valueChangedCallback($event)" [maxItemCount]="maxItemCount"
                         [showClearButton]="true"
                         [disabled]="disabled"
                         (onValueChanged)="valueChangedClearCallback($event)">

            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>
        </dx-autocomplete>
    `
})
export class AutocompleteComponent extends BaseComponent {

    @Input()
    validationGroup: string;

    @Input()
    readOnly: boolean = false;

    @Input()
    searchExpr: Function | Array<Function>;

    @Input()
    disabled: boolean=false;

    @Input()
    valueExpr: string = "getDisplayValue";

    @ViewChild("editor", { static: true })
    editor: DxAutocompleteComponent;

    constructor(private domHandler: DomHandler, private injector: Injector) {
        super(injector);
    }

    private _selected: any;
    get selected() {
        return this._selected;
    }

    focus() {
        this.editor.instance.focus();
    }

    @Input()
    set selected(value) {
        if (value && !_.isString(value) && value.getDisplayValue) {
            this._selected = value.getDisplayValue();
        } else if (value) {
            this._selected = value
        } else {
            this._selected = null;
        }
    }

    @Input()
    placeholder: string;

    @Input()
    items: any;

    @Input()
    maxItemCount: number = 10;

    @Output()
    onQueryChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    selectedChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    width: number;

    @Input()
    height: number;

    private querySubject: Subject<string> = new Subject<string>();

    private keyUpSubscription: Subscription;

    private lastQuery: string;

    reset(): void {
        this.editor.instance.reset();
    }

    onKeyUp(event) {
        let elem = this.domHandler.jQuery(this.editor.instance.element()).find('input');
        let query: string = elem.val();
        if (query != this.lastQuery) {
            this.lastQuery = query;
            if (query != '') {
                this.querySubject.next(query);
            } else {
                this.selectedChange.emit(null);
            }
        }
    }

    //apenas para o clearButton
    valueChangedClearCallback(event) {
        let elem = this.domHandler.jQuery(this.editor.instance.element()).find('input');
        let query: string = elem.val();
        if (query == null || query == "") {
            this.selectedChange.emit(null);
        }
    }

    valueChangedCallback(event) {
        this.selectedChange.emit(event.itemData);
    }

    doOnInit(): void {
        this.keyUpSubscription = this.querySubject.pipe(debounceTime(300)).subscribe(value => {
            this.onQueryChanged.emit(value);
        });
    }

    doOnDestroy(): void {
        this.keyUpSubscription.unsubscribe();
    }

}
