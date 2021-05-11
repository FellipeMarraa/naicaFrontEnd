import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList
} from "@angular/core";
import {WizardStepComponent} from "./wizard.step.component";
import {WizardStepChangedEvent} from "../classes/wizard.step.changed.event";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "wizard",
    styleUrls: ['wizard.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: "./wizard.component.html",
})
export class WizardComponent implements AfterContentInit {

    @ContentChildren(WizardStepComponent) steps: QueryList<WizardStepComponent>;

    @Input()
    showStepsButton: boolean = true;

    @Input()
    showSuccessButton: boolean = true;

    @Output()
    onStep: EventEmitter<WizardStepChangedEvent>;

    @Output()
    onSuccess: EventEmitter<any>;

    private _step: number;

    ngAfterContentInit(): void {
        if (!this.step) {
            this.step = 1;
        } else {
            this.applyState();
        }
    }

    @Input()
    set step(value: number) {
        let prev = this._step ? this._step : 0;
        this._step = value;

        //exibe conteudo do passo
        this.applyState();

        //notifica mudança
        if (this.onStep) {
            this.onStep.next({
                step: value,
                prevStep: prev
            });
        }
    }

    get step(): number {
        return this._step;
    }

    get totalSteps(): number {
        if (!this.steps) {
            return 0;
        }
        return this.steps.length;
    }

    prev() {
        if (this.step > 1) {
            this.step = this.step - 1;
        }
    }

    next() {
        if (this.step < this.totalSteps) {
            this.step = this.step + 1;
        }
    }

    finish() {
        if (this.onSuccess) {
            this.onSuccess.next();
        }
    }

    private applyState(): void {
        if (this.steps) {
            this.steps.forEach(stepComp => stepComp.show = stepComp.when == this._step);
        }
    }


}
