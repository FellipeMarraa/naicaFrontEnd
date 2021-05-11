import {Component, Input} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'youtube-player',
    template: `
        <div *ngIf="videoSrc">
            <iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="881.1" height="495"
                    type="text/html" [src]="videoSrc"></iframe>
        </div>`
})
export class YoutubePlayerComponent {

    private _videoUrl: string;

    private _videoId: string;

    videoSrc = null;

    @Input()
    get videoUrl(): string {
        return this._videoUrl;
    }

    set videoUrl(value: string) {
        this._videoUrl = value;
        if (value) {
            this.videoId = value.split('?v=')[1];
        }
    }

    @Input()
    get videoId(): string {
        return this._videoId;
    }

    set videoId(value: string) {
        this._videoId = value;
        if (value) {
            this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this._videoId +
                '?autoplay=1&fs=1&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0');
        }
    }

    constructor(private sanitizer: DomSanitizer) {

    }

}