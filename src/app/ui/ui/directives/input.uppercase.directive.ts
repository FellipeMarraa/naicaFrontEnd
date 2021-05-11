import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2, Self} from "@angular/core";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Directive({
    selector: "[inputUppercase]",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputUppercaseDirective),
            multi: true,
        },
    ],
})
export class InputUppercaseDirective {

    /** implements ControlValueAccessorInterface */
    _onChange: (_: any) => void;

    /** implements ControlValueAccessorInterface */
    _touched: () => void;

    constructor( @Self()
                 private _el: ElementRef,
                 private _renderer: Renderer2) {
    }

    /**
     * Nao consegui fazer funcionar, esta diretiva deveria deixar o dx-text-box em caixaAlta. :(
     *
      */

/*
    @HostListener('onValueChanged', ['$event'])
    onValueChanged(evt: any) {
        debugger;

        evt.value = evt.value.toUpperCase();
        evt.component.value = evt.value.toUpperCase();
        evt.component.text = evt.value.toUpperCase();
    }
*/


    /** Trata as teclas */
/*
    @HostListener('keyup', ['$event'])
    onKeyDown(evt: KeyboardEvent) {
        const keyCode = evt.keyCode;
        const key = evt.key.toUpperCase();
        console.log(evt);
        debugger;
        // if (keyCode >= A && keyCode <= Z) {
        if (key >= 'A' && key <= 'Z') {
            const value = this._el.nativeElement.value.toUpperCase();
            this._renderer.setProperty(this._el.nativeElement, 'value', value);
            this._onChange(value);
            evt.preventDefault();
        }
    }

    @HostListener('blur', ['$event'])
    onBlur() {
        this._touched();
    }
*/


}
