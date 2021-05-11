import {Component, EventEmitter, Injector, Input, Output} from "@angular/core";
import {BaseComponent} from "../base-component/base.component";
import {MessageBoxUiService} from "../services/message.box.ui.service";

@Component({
    selector: "data-field-info",
    templateUrl: "./data.field.info.component.html"
})
export class DataFieldInfoComponent extends BaseComponent {

    @Input()
    icon: string = "fa fa-question-circle";

    @Input()
    cssClass: string = "";

    @Input()
    labelDataField: string;

    @Input()
    message: string;

    @Input()
    hint: string;

    @Input()
    doDefaultShowing = true;

    @Output()
    onClick: EventEmitter<any> = new EventEmitter();

    constructor(private messageBoxUiService: MessageBoxUiService, private injector: Injector) {
        super(injector);
    }

    doOnInit() {
        this.hint = "Mostrar detalhamento do campo " + this.labelDataField;
    }

    onBtnClicked(event) {
        if (this.doDefaultShowing) {
            this.messageBoxUiService.show(this.message);
        }
        this.onClick.emit({
            event: event,
            hint: this.hint,
            labelDataField: this.labelDataField,
            message: this.message
        });
    }
}
