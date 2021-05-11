import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'youtube-popup-player',
    template: `
        <dx-popup [width]="930"
                  [height]="555"
                  [showTitle]="true"
                  [title]="videoTitle"
                  [showCloseButton]="true"
                  [dragEnabled]="false"
                  [closeOnOutsideClick]="true"
                  [(visible)]="visible">

            <div *dxTemplate="let data of 'content'">
                <div *ngIf="visible">
                    <youtube-player [videoId]="videoId"></youtube-player>
                </div>
            </div>

        </dx-popup>
    `
})
export class YoutubePopupPlayerComponent {

    private _visible: boolean;

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        const notify = value != this._visible;
        this._visible = value;
        if (notify) {
            this.visibleChange.emit(value);
        }
    }

    @Output()
    visibleChange: EventEmitter<boolean> = new EventEmitter();

    @Input()
    videoId: string;

    @Input()
    videoTitle: string;

}