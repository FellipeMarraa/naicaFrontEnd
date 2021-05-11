import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {MessageType} from "../classes/message.type";

import * as _ from 'lodash';
import {Message} from "../classes/message";
import {DxTextAreaComponent} from "devextreme-angular";
import {WindowRefService} from "../../app/services/window-ref.service";
import {DomHandler} from "../../app/services/dom.handler";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: 'message-panel',
    styleUrls: ['message-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,

    templateUrl: './message-panel.component.html'
})
export class MessagePanelComponent {

    private _messageType: MessageType;

    private _messages: Message[];

    private _originalMessages: string | string[] | Message | Message[];

    private _iconsMap: Map<MessageType, string> = new Map();

    private _visible: boolean = false;

    detailsVisible: boolean = false;

    currentDetails: string;

    constructor(private windowRef: WindowRefService, private domHandler: DomHandler) {
        this._iconsMap.set("ERROR", "/GRP/assets/images/icons-lib/inverted/1103-notification.png");
        this._iconsMap.set("INFO", "/GRP/assets/images/icons-lib/inverted/1121-info.png");
        this._iconsMap.set("SUCCESS", "/GRP/assets/images/icons-lib/inverted/circle-check.png");
        this._iconsMap.set("WARNING", "/GRP/assets/images/icons-lib/inverted/notice.png");
    }

    currentPage: number = 0;

    @Input()
    pageSize: number = 4;

    get pages(): number[] {
        if (_.isEmpty(this._messages)) {
            return [0];
        }
        return _.range(Math.ceil(this._messages.length / this.pageSize));
    }

    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set visible(value: boolean) {

        this._visible = value;
        this.visibleChange.next(value);
    }

    get visible(): boolean {
        return this._visible;
    }

    @Input()
    set messageType(value: MessageType) {
        this._messageType = value;
    }

    get messageType(): MessageType {
        if (!this._messageType) {
            return "ERROR";
        }
        return this._messageType;
    }

    @Input()
    set messages(value: string | string[] | Message | Message[]) {

        this._originalMessages = value;

        if (_.isArray(value)) {
            this._messages = (<any[]>value).map(v => {
                if (_.isString(v)) {
                    return {content: v};
                }
                return v;
            });
        } else if (_.isString(value)) {
            this._messages = [{content: value}];
        } else if (!_.isNil(value)) {
            this._messages = <Message[]>[value];
        } else {
            this._messages = null;
        }

    }

    get messages(): string | string[] | Message | Message[] {
        return this._originalMessages;
    }

    get messageCount(): number {
        if (!this._messages) {
            return 0;
        }
        return this._messages.length;
    }

    get currentPageContent(): Message[] {
        if (_.isNil(this._messages)) {
            return null;
        }

        let offset = this.pageSize * this.currentPage;
        let end = offset + this.pageSize;
        return this._messages.slice(offset, end);
    }

    get icon(): string {
        return this._iconsMap.get(this.messageType);
    }

    nextPage() {

        if (this.currentPage < this.pages.length - 1) {
            this.currentPage = this.currentPage + 1;
        }

    }

    prevPage() {

        if (this.currentPage > 0) {
            this.currentPage = this.currentPage - 1;
        }

    }

    showDetails(details: string) {
        this.currentDetails = details;
        this.detailsVisible = true;
    }



}
