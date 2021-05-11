import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {WindowRefService} from "../../app/services/window-ref.service";

import * as _ from 'lodash';

/* ckeditor will ignore this values */
const IS_EMPTY: string = "&nbsp;";
const IS_NULL: string = "null";
const UPDATED: string = "__updated__";

@Component({
    selector: 'ckeditor',
    template: `
        <auto-size-container (heightChange)="buildEditor()">
            <div #container style="width:100%;height:100%" [ngStyle]="{border: hasError ? '1px solid rgba(217, 83, 79, 0.4)' : null, backgroundColor: hasError ? 'rgba(217, 83, 79, 0.1)' : null}"></div>
            <dx-text-box *ngIf="validationGroup" style="display: none">
                <dx-validator [validationGroup]="validationGroup">
                    <dxi-validation-rule type="custom" [validationCallback]="validate" [reevaluate]="true"></dxi-validation-rule>
                </dx-validator>
            </dx-text-box>
        </auto-size-container>
    `
})
export class CkeditorComponent implements AfterViewInit, OnChanges {

    private _viewInitialized: boolean = false;

    private _editor: any;

    private _editorFrame: any;

    private _text: string;

    private _readOnly: boolean;

    @ViewChild("container", { static: true })
    container: ElementRef;

    @Input()
    templateFields: string[];

    @Input()
    printFilename: string;

    @Input()
    set readOnly(value: boolean) {
        this._readOnly = value;

        if (this._editorFrame) {
            this._editorFrame.setReadOnly(value);
        }
    }

    get text(): string {
        return this._text;
    }

    @Input()
    set text(value: string) {
        if (this._text == value) {
            return;
        }
        this._text = value;
        if (this._viewInitialized && this._editor) {
            try {
                this._editor.setData(value);
            } catch (e) {
                
            }
        }
    }

    @Output()
    textChange: EventEmitter<string> = new EventEmitter();

    @Input()
    validationGroup: string;

    @Input()
    required: boolean = false;

    @Input()
    requiredErrorMessage: string = "Campo obrigatório";

    hasError: boolean = false;

    constructor(private domHandler: DomHandler,
                private windowRefService: WindowRefService,
                private ngZone: NgZone) {

        this.validate = this.validate.bind(this);
    }

    ngAfterViewInit(): void {
        this._viewInitialized = true;
        this.buildEditor();
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (!this._viewInitialized) {
            return;
        }

        if (changes['templateFields'] || changes['printFilename']) {
            this.buildEditor();
        }

    }

    validate(data: any) {

        data.rule.isValid = !this.required || (this._text && this._text.trim() != '');

        if (!data.rule.isValid) {
            data.rule.message = this.requiredErrorMessage;
        }

        this.hasError = !data.rule.isValid;

        return data.rule.isValid;
    }

    buildEditor(): void {

        let $ = this.domHandler.jQuery();
        let containerElem = this.container.nativeElement;

        $(containerElem).empty();
        this._editor = null;

        let frame = $('<iframe src="/GRP/assets/ckeditor-frame.html" style="width: 100%; height: 100%;" frameborder="0" scrolling="no"></iframe>');


        this.ngZone.run(() => {
            frame.on('load', () => {

                let printCallback = url => {
                    this.windowRefService.nativeWindow().location.replace(url);
                };

                frame[0].contentWindow.loadEditor(this.templateFields, this.printFilename, printCallback, editor => {

                    this._editor = editor;
                    this._editorFrame = frame[0].contentWindow;

                    if (this._text) {
                        this._editor.setData(this._text);
                    }

                    this._editor.model.document.on('change', () => {
                        if (this._editor.model.document.differ.getChanges().length > 0) {
                            this._text = this._editor.getData();
                            if (this._text == IS_EMPTY || this._text == IS_NULL || this._text.includes(UPDATED)) {
                                this._text = undefined;
                            }
                            this.textChange.emit(this._text);

                        }
                    });

                    if (!_.isNil(this._readOnly)) {
                        this._editorFrame.setReadyOnly(this._readOnly);
                    }
                });

            });
        });

        frame.appendTo($(containerElem));

    }

}
