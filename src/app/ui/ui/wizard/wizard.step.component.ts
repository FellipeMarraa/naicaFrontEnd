import {Component, Input} from "@angular/core";

@Component({
    selector: "step",
    template: `
    <div *ngIf="show"><ng-content></ng-content></div>
  `
})
export class WizardStepComponent {

    @Input()
    when: number;

    private _stepTitle: string;

    private _show = false;

    @Input()
    set show(value) {
        this._show = value;
    }

    get show() {
        return this._show;
    }

    @Input()
    set stepTitle(value) {
        this._stepTitle = value;
    }

    get stepTitle(): string {
        if (!this._stepTitle) {
            return "Passo " + this.when;
        }
        return this._stepTitle;
    }


}
