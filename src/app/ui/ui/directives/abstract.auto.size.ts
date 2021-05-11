import {DomHandler} from "../../app/services/dom.handler";
import {AppStateService} from "../../app/services/app.state.service";
import {Directive, ElementRef, Injector} from "@angular/core";

@Directive()
export abstract class AbstractAutoSize {

    appState: AppStateService;
    private domHandler: DomHandler;

    triggerWidth: boolean;
    triggerHeight: boolean;

    constructor(injector: Injector, _triggerWidth: boolean, _triggerHeight: boolean) {
        this.appState = injector.get(AppStateService);
        this.domHandler = injector.get(DomHandler);
        this.triggerWidth = _triggerWidth;
        this.triggerHeight = _triggerHeight;
    }

    abstract get elementRef(): ElementRef;

    adjustInit() {

    }

    adjust() {
        if (this.triggerWidth) {
            this.adjustWidth();
        }
        if (this.triggerHeight) {
            this.adjustHeight();
        }
    }

    /** Template methods **/
    adjustHeight() {
    }

    adjustWidth() {
    }

    public getHeighTop(): number {
        return this.getElement()[0].offsetTop;
    }

    public getHeighWindowComponent(): number {
        return this.getDomHandler().jQuery(".component-restricted-area").height();
    }

    public getWidthWindowComponent(): number {
        return this.getDomHandler().jQuery(".component-restricted-area").width();
    }

    public getWidthComponentArea(): number {
        return this.getDomHandler().jQuery(this.getElementRef().nativeElement).closest('.component-restricted-area').width();
    }

    public getRootNode(el: Element): any {
        return this.getDomHandler().jQuery(el).closest(".component-restricted-area");
    }

    public getHeightSiblings(rootElement: Element): number {
        let height: number = 0;
        const domHandler = this.getDomHandler();
        domHandler.jQuery(rootElement).siblings().each(function (e) {
            var element = domHandler.jQuery(this);
            height += element.height();
        });
        return height;
    }

    public calcHeightBasedOnElement(diffSiblings?): number {

        const windowComponentElement = this.getDomHandler().jQuery(".component-restricted-area")[0];

        /* Nó Raiz */
        const rootElement = this.getRootNode(this.getElementRef().nativeElement);

        if (rootElement[0] == windowComponentElement) {
            return this.getHeighWindowComponent() - this.getHeighTop() - 14;
        }

        return rootElement.height() - 30;
    }

    public getElement(): any {
        return this.domHandler.jQuery(this.elementRef.nativeElement);
    }

    getAppState() {
        return this.appState;
    }

    getDomHandler() {
        return this.domHandler;
    }

    getElementRef() {
        return this.elementRef;
    }

}
