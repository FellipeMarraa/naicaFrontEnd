import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ArquivoDigitalPreviewService} from "../services/arquivo.digital.preview.service";
import {DomHandler} from "../../app/services/dom.handler";

@Component({
    selector: "arquivo-digital-preview",
    styleUrls: ["arquivo.digital.preview.component.scss"],
    templateUrl: "arquivo.digital.preview.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ArquivoDigitalPreviewComponent implements OnInit {

    @ViewChild("iframe")
    iframe: ElementRef;

    idArquivoDigital: number;

    visible: boolean = false;

    arqSrc: SafeResourceUrl = null;

    constructor (private service: ArquivoDigitalPreviewService,
                 public sanitizer: DomSanitizer,
                 private domHandler: DomHandler) {
    }

    ngOnInit(): void {
        this.service.getObservable().subscribe(arg => {
            this.visible = true;

            if (typeof(arg) === 'number') {
                this.idArquivoDigital = arg;
                this.arqSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`/servlets/downloadArquivoDigital?id=${this.idArquivoDigital}`);
            } else if (typeof(arg) === 'string') {
                this.arqSrc = this.sanitizer.bypassSecurityTrustResourceUrl(arg);
            } else {
                this.visible = false;
                this.arqSrc = null;
            }
        })
    }

    contentSizeChanged(size: any) {
        // if (this.iframe) {
        //     this.domHandler.jQuery(this.iframe.nativeElement)
        //         .css({width: size.contentWidth + 'px', height: (size.contentHeight - 50) + 'px'});
        //     this.domHandler.jQuery(this.iframe.nativeElement)
        //         .contents().find('img').css({width: '100%', 'height': 'auto'});
        // }
    }
}