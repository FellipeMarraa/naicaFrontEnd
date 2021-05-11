import {Component, ElementRef, Injector, Input, ViewContainerRef} from "@angular/core";
import {DomHandler} from '../../app/services/dom.handler';
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {Subscription} from "rxjs";
import {MessageType} from "../classes/message.type";
import {MessageBoxUiService} from "../services/message.box.ui.service";
import {Message} from "../classes/message";
import {AppStateService} from "../../app/services/app.state.service";
import {BaseComponent} from "../base-component/base.component";
import {WindowManagerService} from "../../home/services/window.manager.service";
import {ViewEncapsulation} from "@angular/core"
import {AutoSizeService} from "../services/auto.size.service";
import {TabPanelService} from "../services/tab.panel.service";
import {WindowState} from "../../home/classes/window.state";

@Component({
    selector: "base-view",
    templateUrl: "./base.view.component.html",
    styleUrls: ["./base.view.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers:[AutoSizeService, TabPanelService]
})
export class BaseViewComponent extends BaseComponent {

    doOnDestroy(): void {

        if (this.windowResizeSubscription) {
            this.windowResizeSubscription.unsubscribe();
        }

        if (this.currentWindowSubscription) {
            this.currentWindowSubscription.unsubscribe();
        }
    }


    constructor(
        private domHandler: DomHandler,
        private utils: ObjectUtilsService,
        private appStateService: AppStateService,
        private messageBoxUiService: MessageBoxUiService,
        private injector: Injector,
        private rootElementRef: ElementRef,
        private __wms: WindowManagerService) {

        super(injector);
    }

    @Input() cssClass;

    @Input() embedded = false;

    messagePanelVisible: boolean = false;

    messages: string | string[] | Message | Message[];

    messageType: MessageType = "ERROR";

    private windowResizeSubscription: Subscription;

    private currentWindowSubscription: Subscription;

    private currentWindow: WindowState;

    /**
     * life Cycle NG
     */

    doAfterViewInit(): void {
    }

    doOnInit() {
        this.currentWindowSubscription = this.appStateService.currentWindow.subscribe(w => {
            this.currentWindow = w;
        });
    }


    closeMessage() {
        this.messagePanelVisible = false;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('closeMessage');
        });
    }

    showErrorMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "ERROR";
        this.messages = message;
        this.messagePanelVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showErrorMessage');
        });
    }

    showSuccessMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "SUCCESS";
        this.messages = message;
        this.messagePanelVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showSuccessMessage');
        });
    }

    showInfoMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "INFO";
        this.messages = message;
        this.messagePanelVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showInfoMessage');
        });
    }

    showWarningMessage(message: string | string[] | Message | Message[]): void {
        this.messageType = "WARNING";
        this.messages = message;
        this.messagePanelVisible = true;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('showWarningMessage');
        });
    }

    hideMessages(): void {
        this.messageType = null;
        this.messages = null;
        this.messagePanelVisible = false;

        setTimeout(() => {
            this.appStateService.resizedWindow.next('hideMessages');
        });
    }

    /**
     * toolbar
     */

    @Input() toolbarFullOverride: boolean = false;

    @Input() toolbarCssClass: string = "crud-toolbar";

    @Input() toolbarRightSectionCssClass: string = "base-toolbar-right-section";

    @Input() toolbarLeftSectionCssClass: string;

    @Input() toolbarShowLeftSection: boolean = true;

    @Input() toolbarShowRightSection: boolean = true;

    @Input() toolbarTitle;

    @Input() toolbarTitleCssClass;

    @Input() toolbarAllButtonsCssClass = "base-toolbar-buttons";

    onToolbarCloseButtonAction(event) {
        this.doClose();
    }


    /**
     * right section buttons
     */

    /**
     * close button
     */

    @Input() listToolbarCloseButtonCssClass;
    @Input() listToolbarCloseButtonIconClass = "fa fa-times-circle";
    @Input() listToolbarCloseButtonText = "Fechar";
    @Input() listToolbarCloseButtonOrder = 3;
    @Input() listToolbarCloseButtonShow = true;
    @Input() listToolbarCloseButtonTitle = "Fechar";
    @Input() listToolbarCloseButtonDisabled = false;


    /**
     * toolbar listeners
     */

    onCloseButtonMessagePanel(valor) {
        if (this.messagePanelVisible != valor) {
            setTimeout(() => {
                this.appStateService.resizedWindow.next('onCloseButtonMessagePanel');
            });
        }
        this.messagePanelVisible = valor;
    }

    private doClose() {
        if (this.currentWindow) {
            this.__wms.deactivateByComponent(this.currentWindow.context.componentRef.instance);
        }
    }

    private getRootHost(parent: any): any {
        if (parent && parent.parent && parent.parent.parent != null) {
            return this.getRootHost(parent.parent);
        }

        return parent;
    }


}
