import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    AfterViewInit,
    AfterContentInit,
    Input,
    ViewRef,
    ContentChild,
    TemplateRef,
    NgZone,
    ViewEncapsulation,
    ElementRef,
    AfterViewChecked,
    Output,
    EventEmitter
} from '@angular/core';
import {DxPopupComponent, DxTemplateDirective} from 'devextreme-angular';
import {ObjectUtilsService} from "../../core/commons/services/object.utils.service";
import {DomHandler} from "../../app/services/dom.handler";

@Component({
    selector: 'classic-dynamic-modal',
    templateUrl: './classic.dynamic.modal.component.html',
    styleUrls: ['./classic.dynamic.modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClassicDynamicModalComponent implements OnInit, AfterViewChecked {
    static readonly DEFAULT_HEADER_HEIGHT_IN_PIXELS: number = 18;

    @Input()
    instanceId: string;

    @Input()
    popupVisible = false;

    @Input()
    title: string = 'Detalhes';

    @Input()
    closeAreaTitle: string = 'Fechar';

    @Input()
    cssClass = 'dynamic-popup';

    @ViewChild('content', { read: ViewContainerRef })
    content: ViewContainerRef;

    @Output()
    onCloseClick: EventEmitter<any> = new EventEmitter<any>();

    private topValue: string;

    private leftValue: string;

    private widthValue: string;

    private heightValue: string;

    constructor(private root: ElementRef, private domHandler: DomHandler) {
    }

    closeClick() {
        this.onCloseClick.emit();
    }

    width(width: string): void {
        const dom = this.domHandler;
        this.widthValue = width;
        dom.jQueryWithContext('.dynamic-popup', dom.jQuery(this.root.nativeElement)).each(function () {
            dom.jQuery(this).css('width', width);
        })
    }

    height(height: string): void {
        const dom = this.domHandler;
        this.heightValue = height;
        dom.jQueryWithContext('.dynamic-popup', dom.jQuery(this.root.nativeElement)).each(function () {
            dom.jQuery(this).css('height', height);
        });
    }

    top(top: string): void {
        const dom = this.domHandler;
        this.topValue = top;
        dom.jQueryWithContext('.dynamic-popup', dom.jQuery(this.root.nativeElement)).each(function () {
            dom.jQuery(this).css('top', top);
        });
    }

    left(left: string): void {
        const dom = this.domHandler;
        this.leftValue = left;
        dom.jQueryWithContext('.dynamic-popup', dom.jQuery(this.root.nativeElement)).each(function () {
            dom.jQuery(this).css('left', left);
        });
    }

    ngOnInit() {
    }

    ngAfterViewChecked(): void {
    }

    setView(viewRef: ViewRef) {
        const vcr = this.getViewContainerRef();
        vcr.clear();
        const res: ViewRef = vcr.insert(viewRef, vcr.length);
        return res;
    }

    addView(viewRef: ViewRef) {
        const vcr = this.getViewContainerRef();
        const res: ViewRef = vcr.insert(viewRef);
        return res;
    }

    getViewContainerRef(): ViewContainerRef {
        return this.content;
    }
}
