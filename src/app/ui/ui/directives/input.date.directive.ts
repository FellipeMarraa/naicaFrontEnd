import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    selector: "[inputDate]"
})
export class InputDateDirective {

    @Input('inputDate') world: string;

    @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
        this.__onKeyPress(event);
    }

    strategy: any = new Map();

    constructor(
        private elementRef: ElementRef) {

        this.strategy.set('N', /[/0-9]/);
    }

    private __onKeyPress(event: any) {
        const regEx = this.strategy.get(this.world ? this.world : 'N');
        if (!regEx.test(event.key)) {
            event.preventDefault();
        }
    }
}
