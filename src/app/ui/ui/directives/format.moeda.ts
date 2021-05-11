import {AfterViewInit, Directive, ElementRef} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";

@Directive({
    selector: "[formataMoeda]"
})
export class FormatMoeda implements AfterViewInit {

    constructor( private domHandler: DomHandler,
                 private elementRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        this.domHandler.aplicaMaskMoeda(this.elementRef.nativeElement);
    }

}
