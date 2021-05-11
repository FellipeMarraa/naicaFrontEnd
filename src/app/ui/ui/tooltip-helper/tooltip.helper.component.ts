import {Component, ElementRef, Injector, Input, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {DxButtonComponent} from "devextreme-angular";
import {AppStateService} from "../../app/services/app.state.service";
import {DomHandler} from "../../app/services/dom.handler";

let tooltipHelperIdGen: number = 0;

@Component({
    selector: 'tooltip-helper',
    templateUrl: './tooltip.helper.component.html',
    styleUrls: ['./tooltip.helper.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class TooltipHelperComponent extends BaseComponent {

    private hasTransclusion: boolean = false;

    constructor(private injector: Injector,
                private domHandler: DomHandler) {
        super(injector);
        tooltipHelperIdGen = tooltipHelperIdGen + 1;
        this.idTooltipButton =  this.constructor.name + tooltipHelperIdGen;
    }

    @ViewChild("tooltipButton", { static: true }) tooltipButton: DxButtonComponent;


    private elementRef: ElementRef;

    @ViewChild("tooltipNgContent") set content(content: ElementRef) {
        this.elementRef= content;
    }

    tooltipVisible: boolean = false;
    idTooltipButton: string;

    @Input()
    disabledTooltip: boolean = false;

    @Input()
    text: string;

    @Input()
    visible: boolean = true;

    @Input()
    clickMode: boolean = false;

    @Input()
    information: boolean = false;

    @Input()
    iconText: string;

    @Input()
    icon: string = 'fa fa-question';

    private _backgroudColor: string = '#70ABE5';

    get backgroudColor(): string {
        return this._backgroudColor;
    }
    @Input()
    set backgroudColor(value: string) {
        if(this.backgroudColor != value) {
            this._backgroudColor = value;
            this.definebackgroudColor(value);
        }

    }

    ngOnInit(): void {
        this.icon = this.information ? 'fa fa-info' : 'fa fa-question';
    }

    doAfterViewInit() {

        setTimeout(() => {
            if(this.elementRef && this.elementRef.nativeElement && this.elementRef.nativeElement) {
                this.hasTransclusion = this._.isEmpty(this.elementRef.nativeElement.innerHTML.trim()) ? false : true
            } else {
                this.hasTransclusion = false;
            }

        });

        this.defineCss();
    }

    definebackgroudColor(color: string) {
        if(color && this.tooltipButton && this.tooltipButton.instance) {
            const tooltipButtonElemento = this.domHandler.jQuery(this.tooltipButton.instance.element());
            tooltipButtonElemento.css("background", color);
        }
    }

    defineCss() {
        const tooltipButtonElemento = this.domHandler.jQuery(this.tooltipButton.instance.element());

        this.definebackgroudColor(this.backgroudColor);

        tooltipButtonElemento.find("div").attr("style",
            'padding: 0px !important');

        tooltipButtonElemento.find("div > i").attr("style",
            'line-height: 14px; ' +
            'font-size: 12px; ' +
            'width: auto; ' +
            'height: auto; ' +
            'color: white !important;');
    }

    tooltipMouseleave(event: MouseEvent) {
        this.setShowTooltip(false);
    }

    tooltipMouseenter(event: MouseEvent) {
        this.setShowTooltip(true);
    }

    private setShowTooltip(value: boolean) {
        if (!this.clickMode) {
            if(value && !this.information) {
                this.domHandler.jQuery(event.srcElement).css( 'cursor', 'help' );
            } else {
                this.domHandler.jQuery(event.srcElement).css( 'cursor', 'default' );
            }

            if(this.hasContent()) {
                this.tooltipVisible = value
            }
        }
    }

    tooltipClick(value: any) {
        if(this.clickMode && this.hasContent()) {
            this.tooltipVisible = !this.tooltipVisible;
        }
    }

    hasContent() :boolean {
        return this.hasTransclusion || !this._.isEmpty(this.text);
    }

}
