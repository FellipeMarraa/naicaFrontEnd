import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {WindowManagerService} from "../../home/services/window.manager.service";
import {Subscription, Observable} from "rxjs";
import {WindowRefService} from "../../app/services/window-ref.service";
import {Message} from "../classes/message";
import {MessageType} from "../classes/message.type";
import {ExceptionInfoService} from "../services/exception.info.service";
import {ExceptionInfo} from "../../core/commons/classes/exception.info";
import {UiPrintService} from "../services/ui.print.service";

@Component({
    selector: "base-route-view",
    styleUrls: ['base.route.view.component.scss'],
    templateUrl: "base.route.view.component.html",
    encapsulation: ViewEncapsulation.None
})
export class BaseRouteViewComponent {

    @Input()
    viewTitle: string;

    @Input()
    closeButtonShow: boolean = true;
    @Input()
    closeButtonTitle: string = "Fechar";
    @Input()
    closeButtonCssClass: string;
    @Input()
    closeButtonIconClass: string = "fa fa-times-circle";
    @Input()
    closeButtonText: string = "Fechar";

    @Input()
    printButtonShow: boolean = false;
    @Input()
    printButtonTitle: string = "Imprimir";
    @Input()
    printButtonCssClass: string;
    @Input()
    printButtonIconClass: string = "fa fa-print";
    @Input()
    printButtonText: string = "Imprimir";

    @Input()
    toolbarCssClass: string;

    @Input()
    target: any;

    rendering: boolean = false;

    messagePanelVisible: boolean = false;

    messages: string | string[] | Message | Message[];

    messageType: MessageType = "ERROR";

    constructor(private domHandler: DomHandler,
                private elementRef: ElementRef,
                private windowManagerService: WindowManagerService,
                private exceptionInfoService: ExceptionInfoService,
                private uiPrintService: UiPrintService){}

    onCloseButtonAction() {
        if (this.target) {
            this.windowManagerService.deactivateByComponent(this.target);
        }
    }

    onPrintButtonAction() {
        this.uiPrintService.print();
    }

    closeMessage() {
        this.messagePanelVisible = false;
    }

    showErrorMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "ERROR";
        this.messages = message;
        this.messagePanelVisible = true;
    }

    showSuccessMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "SUCCESS";
        this.messages = message;
        this.messagePanelVisible = true;
    }

    showInfoMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "INFO";
        this.messages = message;
        this.messagePanelVisible = true;
    }

    showWarningMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "WARNING";
        this.messages = message;
        this.messagePanelVisible = true;
    }

    handleError(error: ExceptionInfo): void {

        this.showErrorMessage(this.exceptionInfoService.toMessages(error));

    }

}
