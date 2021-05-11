import {Component, EventEmitter, Injector, Input, Output, ViewEncapsulation} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {EnumUtils} from "../../app/classes/enum.utils";
import {DomHandler} from "../../app/services/dom.handler";

export enum LabelTagTypeEnum {
    DEFAULT = '#777',
    PRIMARY = '#337ab7',
    SUCCESS = '#5cb85c',
    INFO = '#5bc0de',
    WARNING = '#f0ad4e',
    DANGER = '#d9534f'
}

let labeltagIdGen: number = 0;

@Component({
    selector: 'label-tag',
    templateUrl: './label.tag.component.html',
    styleUrls: ['./label.tag.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LabelTagComponent extends BaseComponent {
    constructor(private injector: Injector,
                private domHandler: DomHandler) {
        super(injector);
        labeltagIdGen = labeltagIdGen + 1;
        this.idLabel = this.constructor.name + labeltagIdGen;
    }

    idLabel: string;

    className: {};

    @Input()
    value: string;

    private _type: LabelTagTypeEnum | string = LabelTagTypeEnum.DEFAULT;

    private _width: any;

    private _height: any;

    get width(): any {
        return this._width;
    }

    @Input()
    set width(value: any) {
        if(this._width != value){
            this._width = value;
            this.defineCss();
        }
    }

    get height(): any {
        return this._height;
    }

    @Input()
    set height(value: any) {
        if(this._height != value){
            this._height = value;
            this.defineCss();
        }
    }

    get type(): LabelTagTypeEnum | string {
        return this._type;
    }

    @Input()
    set type(value: LabelTagTypeEnum | string) {
        this._type = value;
        this.defineCss();
    }

    @Input()
    buttonMode: boolean = false;

    @Output()
    onClick: EventEmitter<any> = new EventEmitter<any>();

    protected doAfterViewInit() {
        setTimeout( () => {
            this.defineCss();
        })
    }

    defineCss() {
        const elemento = this.domHandler.jQuery("#" + this.idLabel);
        let style = "" +
            "background-color: " + this.getBackGroudColor() + ";" +
            "width: " + (this.width || 'auto') + ";" +
            "height: " + (this.height || 'auto') + ";"

        if(this.buttonMode) {
            style += "cursor: pointer;"
        }

        elemento.attr("style", style);
    }

    lightenDarkenColor(col: string, amt: number) {
        col = col.replace('#', "");
        let colInt = parseInt(col, 16);
        let newColor = (((colInt & 0x0000FF) + amt) | ((((colInt >> 8) & 0x00FF) + amt) << 8) | (((colInt >> 16) + amt) << 16)).toString(16);
        return "#" + newColor;
    }


    getBackGroudColor(): string {
        const teste = !this._.isEmpty(this.type) &&
            EnumUtils.getKey(LabelTagTypeEnum, this.type) ? this.type :
            LabelTagTypeEnum.DEFAULT;
        return teste;
    }

    getBackGroudColorHover(): string {
        return this.lightenDarkenColor(this.getBackGroudColor(), -50);
    }

    mouseOver($event: MouseEvent) {
        if(this.buttonMode) {
            const elemento = this.domHandler.jQuery("#" + this.idLabel);
            elemento.css('background-color', this.getBackGroudColorHover());
        }
    }

    mouseOut($event: MouseEvent) {
        if(this.buttonMode) {
            const elemento = this.domHandler.jQuery("#" + this.idLabel);
            elemento.css('background-color', this.getBackGroudColor());
        }
    }
}