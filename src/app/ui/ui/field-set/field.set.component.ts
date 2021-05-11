import {Component, Injector, Input} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import * as _ from "lodash";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'field-set',
    templateUrl: './field.set.component.html',
    styleUrls: ['./field.set.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class FieldSetComponent extends BaseComponent {

    constructor(private injector: Injector) {
        super(injector);
    }

    private _height: any = 'auto';
    private _width: any = 'auto';

    @Input()
    alignTitle: string = "left";

    @Input()
    boxMode: boolean = false;

    @Input()
    shadow: boolean = false;

    @Input()
    title: string;

    get height(): any {
        return this._height;
    }

    @Input()
    set height(value: any) {
        const _value = String(value).match(/^[0-9]+$/);
        if (_value) {
            value = _value + 'px';
        }
        this._height = value;
    }

    get width(): any {
        return this._width;
    }

    @Input()
    set width(value: any) {
        const _value = String(value).match(/^[0-9]+$/);
        if (_value) {
            value = _value + 'px';
        }
        this._width = value;
    }
}
