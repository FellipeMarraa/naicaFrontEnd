import {BaseComponent} from "../base-component/base.component";
import {Component, Injector} from "@angular/core";
import {PopupValueReceiver} from "../../core/commons/interfaces/popup.value.receiver";
import {PopupValueProvider} from "../../core/commons/interfaces/popup.value.provider";

@Component({
    selector: 'popup-inner-content',
    template: `<ng-content></ng-content>`
})
export class PopupInnerContentComponent extends BaseComponent implements PopupValueReceiver, PopupValueProvider {
    constructor(private injector: Injector) {
        super(injector);
    }

    content: any = {
        data: {

        }
    };

    providedValue(): any {
        return this.content;
    }

    receiveValue(value) {
        this.content = value ? value : { data:{} }; // never null
    }
}