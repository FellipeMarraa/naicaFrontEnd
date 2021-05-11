import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";

@Component({
    selector: 'monetary-input',
    template: `
        <dx-number-box #dxnb
                       (valueChange)="internalValueChange($event)"
                       (onBlur)="internalBlur($event)"
                       (onFocusIn)="onFocusIn($event)"
                       [value]="value"
                       [format]="format"
                       [width]="width">
            <dx-validator [validationGroup]="validationGroup">
                <dxi-validation-rule [type]="validationType"
                                     [message]="validationMessage"
                                     [validationCallback]="validationCallback">
                </dxi-validation-rule>
            </dx-validator>
        </dx-number-box>
    `
})
export class MonetaryInputComponent extends BaseComponent {

    constructor(private injector: Injector) {
        super(injector);
        this.defaultValidationCallback = this.defaultValidationCallback.bind(this);
        this.validationCallback = this.defaultValidationCallback;
    }

    onFocusIn(e) {
        if (this.clearOnfocus) {
            this.value = null;
        }
    }

    defaultValidationCallback() {
        return true;
    }

    @Input()
    clearOnfocus = true;

    @Input()
    width: any = '100';

    @Input()
    format = '##,##0.00';

    @Input()
    value: any;

    @Input()
    validationType = 'required';

    @Input()
    validationMessage = 'O valor é obrigatorio';

    @Output()
    valueChange: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onBlur: EventEmitter<any> = new EventEmitter<any>();

    internalValueChange(e) {
        this.valueChange.emit(e);
    }

    internalBlur(e) {
        this.onBlur.emit(e);
    }
}
