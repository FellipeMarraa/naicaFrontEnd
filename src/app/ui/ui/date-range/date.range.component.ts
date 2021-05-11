import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {DateRangeVO} from "../classes/date.range.vo";
import {DateUtilsService} from "../../core/commons/services/date.utils.service";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'date-range',
    styleUrls: ['date.range.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
        <dx-form [ngClass]="class" [alignItemLabels]="true" [colCount]="2" [validationGroup]="validationGroup" [width]="'fit-content'">
            <dxi-item dataField="lower" [label]="{visible: showLabelInicio, text: labelInicio}">
                <dx-date-box [width]="widthLower"
                              
                             [max]="maxRange"
                             [(value)]="lower"
                             [type]="type"
                             (onValueChanged)="onValueChanged()"
                             [displayFormat]="displayFormat"
                             [useMaskBehavior]="useMaskBehavior"
                             [calendarOptions]="{maxZoomLevel: maxZoomLevel, minZoomLevel: minZommLevel}">
                    <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
                </dx-date-box>
            </dxi-item>
            <dxi-item dataField="upper" [label]="{text: labelFim, alignment: 'right'}">
                <dx-date-box [width]="widthUpper"
                             
                             [min]="minRange"
                             [(value)]="upper"
                             [type]="type"
                             [displayFormat]="displayFormat"
                             (onValueChanged)="onValueChanged()"
                             [useMaskBehavior]="useMaskBehavior"
                             [calendarOptions]="{maxZoomLevel: maxZoomLevel, minZoomLevel: minZommLevel}">
                    <dxi-validation-rule type="custom" [validationCallback]="validationCallback"></dxi-validation-rule>
                </dx-date-box>
            </dxi-item>
        </dx-form>
    `
})
export class DateRangeComponent extends BaseComponent {

    constructor(private inject: Injector, private dateUtils: DateUtilsService) {
        super(inject);
    }

    private _formData = new DateRangeVO();
    private _maxRange: Date;
    private _minRange: Date;


    get maxRange(): Date {
        return this._maxRange;
    }

    set maxRange(value: Date) {
        this._maxRange = value;
    }

    get minRange(): Date {
        return this._minRange;
    }

    set minRange(value: Date) {
        this._minRange = value;
    }

    get lower(): Date {
        return this._formData.lower;
    }

    set lower(value: Date) {
        this._formData.lower = this.clearTime && value ? this.dateUtils.clearTime(value, true): value;

        if (!this._formData.upper) {
            this._formData.upper = this.clearTime && value ? this.dateUtils.clearTime(value, false): value;
        }

        // this._maxRange = this._formData ? this._formData.upper : null;
        // this._minRange = this._formData ? this._formData.lower : null;

        this.valueChange.emit(this._formData);
    }

    get upper(): Date {
        return this._formData.upper;
    }

    set upper(value: Date) {
        this._formData.upper = this.clearTime && value ? this.dateUtils.clearTime(value, false): value;

        if (!this._formData.lower) {
            this._formData.lower = this.clearTime && value ? this.dateUtils.clearTime(value, true): value;
        }

        // this.maxRange = this._formData ? this._formData.upper : null;
        // this._minRange = this._formData ? this._formData.lower : null;

        this.valueChange.emit(this._formData);
    }

    @Input()
    showLabelInicio: boolean = true;

    @Input()
    class:string;

    @Input()
    labelInicio: string = "De";

    @Input()
    labelFim: string = "Até";

    @Input()
    displayFormat: string;

    @Input()
    useMaskBehavior: string;

    @Input()
    maxZoomLevel: string;

    @Input()
    minZommLevel: string;

    @Input()
    widthLower: number = 135;

    @Input()
    widthUpper: number = 135;

    @Input()
    type: string = 'date';

    @Input()
    clearTime: boolean = false;

    @Input()
    get value(): DateRangeVO {
        return this._formData;
    }

    set value(value: DateRangeVO) {
        if (!value) {
            value = new DateRangeVO();
        }
        this._formData = value;

        this._maxRange = this._formData ? this._formData.upper : null;
        this._minRange = this._formData ? this._formData.lower : null;


    }

    @Output()
    valueChange: EventEmitter<DateRangeVO> = new EventEmitter<DateRangeVO>();

    onValueChanged() {
        this.updateRange();
    }

    updateRange(){
        this.maxRange = this.upper;
        this.minRange = this.lower;
    }
}