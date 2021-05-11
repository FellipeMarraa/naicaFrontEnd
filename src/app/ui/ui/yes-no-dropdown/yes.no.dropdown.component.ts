import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {YesNo} from "../../core/commons/classes/yes.no";
import {BaseComponent} from "../base-component/base.component";

@Component({
    selector: 'yes-no-dropdown',
    template: `
        <dx-select-box [width]="width"
                       [items]="items"
                       [searchEnabled]="false"
                       [displayExpr]="'label'"
                       [(value)]="selected"
                       
                       [showClearButton]="showClearButton"
                       (onSelectionChanged)="onYesNoSelected($event)">
            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
            </dx-validator>
        </dx-select-box>
    `
})
export class YesNoDropdownComponent extends BaseComponent {

    constructor(private injector: Injector) {
        super(injector);
    }

    items: YesNo[] = YesNo.getDefaults();

    @Input()
    width: string;

    @Input()
    showClearButton: boolean = false;

    private _selected: YesNo = this.items[0];

    get selected(): any {
        return this._selected;
    }

    private extract(yesNo: YesNo): YesNo {
        if (yesNo) {
            for (let item of this.items) {
                if (item.yes == yesNo.yes && item.label == yesNo.label) {
                    return item;
                }
            }
        }
        return null;
    }

    @Input()
    set selected(value: any) {
        this._selected = this.extract(YesNo.byValue(value));
        this.emit(this._selected);
    }

    @Output()
    yesNoSelected: EventEmitter<YesNo> = new EventEmitter<YesNo>();

    @Output()
    selectedChange: EventEmitter<YesNo> = new EventEmitter<YesNo>();

    onYesNoSelected(event) {
        this.emit(event.selectedItem);
    }

    emit(data) {
        if (data) {
            this.yesNoSelected.emit(data);
            this.selectedChange.emit(data);
        } else {
            this.yesNoSelected.emit(new YesNo(null, null));
            this.selectedChange.emit(new YesNo(null, null));
        }
    }
}
