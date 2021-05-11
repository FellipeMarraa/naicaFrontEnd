import {AfterViewInit, Directive} from "@angular/core";
import {DxCheckBoxComponent} from "devextreme-angular";

/**
 * Diretiva que permite atribuir o valor indeterminate para o checkBox, ou seja, o checkbox pode atribuir
 * true, false e undefined. Ideal para telas de filtro e relatórios
 *
 * @vinicius_carrijo
 */
@Directive({
    selector: 'dx-check-box[dxCheckBoxIndeterminate]'
})
export class DxCheckBoxIndeterminateDirective implements AfterViewInit {


    constructor(
        private hostElement: DxCheckBoxComponent
    ){

    }

    ngAfterViewInit(): void {
        this.actionDirective();
    }

    private actionDirective() {
        this.hostElement.onValueChanged.subscribe(event => {
            if (event.component.skipOnValueChanged) {
                event.component.skipOnValueChanged = false;
                return;
            }
            if (event.component.setUndefinedNextTime) {
                event.component.setUndefinedNextTime = false;
                event.component.skipOnValueChanged = true;
                event.component.option("value", undefined);
                return;
            }
            if (event.value == false) {
                event.component.setUndefinedNextTime = true;
            }

            if(event.value === null) {
                setTimeout(() => event.component.option("value", undefined));
            }
        });
    }
}
