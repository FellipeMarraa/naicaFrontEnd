import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {DxTextAreaComponent} from "devextreme-angular";
import {WindowRefService} from "../../app/services/window-ref.service";
import {DomHandler} from "../../app/services/dom.handler";

@Component({
    selector: 'message-details-popup',
    templateUrl: './message.details.popup.component.html',
    styleUrls: ['message.details.popup.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MessageDetailsPopupComponent {

    private _visible: boolean = false;

    private _copyTimer;

    get visible(): boolean {
        return this._visible;
    }

    @Input()
    set visible(value: boolean) {
        if (value != this._visible) {
            this.visibleChange.emit(value);
        }
        this._visible = value;
    }

    @Input()
    details: string;

    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("detailsText")
    detailsText: DxTextAreaComponent;

    copyMessageVisible: boolean = false;

    constructor(private windowRef: WindowRefService,
                private domHandler: DomHandler) {

    }

    copyDetails() {
        const nativeWin = this.windowRef.nativeWindow();
        const elem = this.detailsText.instance.element();

        this.domHandler.jQuery(elem).find('textarea')[0].select();

        nativeWin.document.execCommand("Copy");

        if (this._copyTimer) {
            nativeWin.clearTimeout(this._copyTimer);
        }

        this.copyMessageVisible = true;

        this._copyTimer = nativeWin.setTimeout(() => {
            this.copyMessageVisible = false;
        }, 5000);
    }

    closeDetails() {
        this.visible = false;
    }

    popupContentReady(event: any) {
        let elem = this.domHandler.jQuery(event.component.content());
        let overlay = elem.parent().parent();
        overlay.addClass('error-message-details');
    }

}
