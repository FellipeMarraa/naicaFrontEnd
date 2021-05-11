import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";

/**
 * @author michael
 */
@Component({
    selector: 'test-input',
    templateUrl: './test.input.component.html'
})
export class TestInputComponent extends BaseComponent {

    constructor(private injector: Injector) {
        super(injector);
    }

    @Input()
    scalarValue: any;

    @Output()
    scalarValueChange: EventEmitter<any> = new EventEmitter();

    onValueChanged(event) {
        this.scalarValueChange.emit(event.value);
    }

    doAfterViewInit(): void {
        console.log('doAfterViewInit', this);
    }

    doOnInit(): void {
        console.log('doOnInit', this);
    }

}
