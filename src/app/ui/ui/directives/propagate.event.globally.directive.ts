import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {AppStateService} from "../../app/services/app.state.service";


/**
 * @author michael
 */
@Directive({
    selector: "[propagateEventGlobally]"
})
export class PropagateEventGloballyDirective implements AfterViewInit, OnDestroy, OnInit {
    constructor(private elementRef: ElementRef,
                private domHandler: DomHandler,
                private appStateService: AppStateService) {
    }

    @Input()
    propagateEventGlobally = [];

    private handler = () => {
        setTimeout(() => {
            this.appStateService.setElementEvents(this);
        });
    };

    private getElement(){
        return this.domHandler.jQuery(this.elementRef.nativeElement);
    }

    ngOnInit(): void {
        this.getElement().bind(this.propagateEventGlobally.join(), this.handler);
    }

    ngOnDestroy(): void {
        if(this.propagateEventGlobally){
            this.propagateEventGlobally.forEach(eventName => {
                this.getElement().unbind(eventName, this.handler);
            });
        }
    }

    ngAfterViewInit(): void {
    }
}
