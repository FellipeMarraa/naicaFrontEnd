import {AfterViewInit, Directive, ElementRef, Input} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";

@Directive({
    selector: "[dxiCheckBoxAlignmentCssClass]"
})
export class DxiCheckBoxAlignmentDirective implements AfterViewInit {
    @Input()
    dxiCheckBoxAlignmentCssClass: string;

    constructor(
        private elementRef: ElementRef,
        private domHandler: DomHandler
    ){

    }

    ngAfterViewInit(): void {
        this.applyStyle(this.findParent(this.domHandler.jQuery(this.elementRef.nativeElement), this.domHandler));
    }

    applyStyle(element: any){
        if (element) {
            if (this.dxiCheckBoxAlignmentCssClass) {
                element.addClass(this.dxiCheckBoxAlignmentCssClass);
            } else {
                element.addClass("dxi-check-box-alignment");
            }
        }
    }

    findParent(element: any, domHandler: DomHandler){
        const parent = element.parent();
        if (!parent){
            return null;
        }
        if (parent.hasClass("dx-item")){
            return parent;
        } else {
            return this.findParent(parent, domHandler);
        }
    }

}
