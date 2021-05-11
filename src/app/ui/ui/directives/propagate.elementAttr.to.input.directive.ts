import {AfterContentInit, AfterViewInit, Directive, ElementRef, Input, ViewContainerRef} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import * as _ from 'lodash';

@Directive({
    selector: "[propagateElementAttrToInput]"
})
export class PropagateElementAttrToInputDirective implements AfterViewInit {

    @Input() elementAttr: any;

    strategyAttr: any = new Map();

    constructor(
        private elementRef: ElementRef,
        private domHandler: DomHandler,
        private viewContainerRef: ViewContainerRef){

        this.strategyAttr.set('class', this.__applyClass);
        this.strategyAttr.set('style', this.__applyStyle);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.findNoHiddenInput(this.domHandler.jQuery(this.elementRef.nativeElement));
        });
    }

    findNoHiddenInput(element: any){
        const target = this.domHandler.jQueryWithContext("input[type!='hidden']", element).first();
        if (target){
            const attrs = this.getAttrs();
            if (attrs){
                Object.keys(attrs).forEach(key => {
                    const strategy = this.strategyAttr.get(key)
                    if(strategy){
                        strategy.call(this, target, attrs[key]);;
                    } else {
                        target.attr(key, attrs[key]);
                    }
                });
            }
        }
    }

    private getAttrs(): Object {
        return this.elementAttr;
    }

    private __applyClass(target: any, attr: string) {
        target.addClass(attr);
    }

    private __applyStyle(target: any, attr: string) {
        const styles: string[] = attr.split(';');
        styles.forEach( style => {
            const _styles: string[] = style.split(':');
            target.css(_styles[0], _styles[1]);
        })
    }

}
