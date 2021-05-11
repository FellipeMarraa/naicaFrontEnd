import {DomHandler} from '../../app/services/dom.handler';
import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Directive({
    selector: "[bindEvent]"
})
export class EventBindDirective implements OnInit {
    @Input("bindEvent") event;
    @Output() onEventBindEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(private element: ElementRef, private domHandler: DomHandler) {
    }

    public ngOnInit(): void {
        const el = this.domHandler.jQuery(this.element.nativeElement);
        const emitter = this.onEventBindEvent;

        el.bind(this.event, function(e){
            emitter.emit(e);
        });
    }
}
