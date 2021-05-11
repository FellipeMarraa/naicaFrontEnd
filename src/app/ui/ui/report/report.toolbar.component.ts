import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
    selector: 'report-toolbar',
    template: `
        <toolbar cssClass="{{cssClass}}" [showLeftSection]="showLeftSection" [showRightSection]="showRightSection">
            <toolbar-left-section cssClass="{{leftSectionCssClass}}">
                <div class="{{titleCssClass}}">{{ title }}</div>
            </toolbar-left-section>
            <toolbar-right-section cssClass="{{rightSectionCssClass}}">
                <div *ngIf="runButtonShow" [ngStyle]="{'order': runButtonOrder}" title="{{runButtonTitle}}">
                    <action-button (action)="onRunButtonAction($event)" cssClass="{{runButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                icon="{{runButtonIconClass}}"
                                text="{{runButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="runSendButtonShow" [ngStyle]="{'order': runSendButtonOrder}" title="{{runSendButtonTitle}}">
                    <action-button (action)="onRunSendButtonAction($event)" cssClass="{{runSendButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                icon="{{runSendButtonIconClass}}"
                                text="{{runSendButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="clearButtonShow" [ngStyle]="{'order': clearButtonOrder}" title="{{clearButtonTitle}}">
                    <action-button  (action)="onClearButtonAction($event)" cssClass="{{clearButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                icon="{{clearButtonIconClass}}"
                                text="{{clearButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="closeButtonShow" [ngStyle]="{'order': closeButtonOrder}" title="{{closeButtonTitle}}">
                    <action-button (action)="onCloseButtonAction($event)" cssClass="{{closeButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                icon="{{closeButtonIconClass}}"
                                text="{{closeButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <ng-content></ng-content>
            </toolbar-right-section>
        </toolbar>
    `
})
export class ReportToolbarComponent implements OnInit {

    /**
     * general
     */
    @Input() cssClass: string;

    @Input() rightSectionCssClass: string;

    @Input() leftSectionCssClass: string;

    @Input() showLeftSection: boolean = true;

    @Input() showRightSection: boolean = true;

    @Input() title;

    @Input() titleCssClass;

    @Input() allButtonsCssClass;

    /**
     * right section buttons
     */
    @Input() runSendButtonCssClass;

    @Input() runButtonCssClass;

    @Input() clearButtonCssClass;

    @Input() closeButtonCssClass;

    /**
     * run button
     */
    @Input() runButtonIconClass = "fa fa-cog";
    @Input() runButtonText = "Gerar";
    @Input() runButtonOrder = 0;
    @Input() runButtonShow = true;
    @Input() runButtonTitle = "Gerar";


    /**
     * run/send button
     */
    @Input() runSendButtonIconClass = "fa fa-cog";
    @Input() runSendButtonText = "Gerar/Enviar";
    @Input() runSendButtonOrder = 1;
    @Input() runSendButtonShow = true;
    @Input() runSendButtonTitle = "Gerar/Enviar";
    /**
     * clear button
     */
    @Input() clearButtonIconClass = "fa fa-eraser";
    @Input() clearButtonText = "Limpar";
    @Input() clearButtonOrder = 2;
    @Input() clearButtonShow = true;
    @Input() clearButtonTitle = "Limpar";

    /**
     * close button
     */
    @Input() closeButtonIconClass = "fa fa-times-circle";
    @Input() closeButtonText = "Fechar";
    @Input() closeButtonOrder = 5;
    @Input() closeButtonShow = true;
    @Input() closeButtonTitle = "Fechar";

    /**
     * listeners
     */
    @Output() runSendButtonAction = new EventEmitter<any>();
    @Output() runButtonAction = new EventEmitter<any>();
    @Output() clearButtonAction = new EventEmitter<any>();
    @Output() closeButtonAction = new EventEmitter<any>();

    onClearButtonAction(event) {
        this.clearButtonAction.emit(event);
    }

    onRunButtonAction(event) {
        this.runButtonAction.emit(event);
    }

    onRunSendButtonAction(event) {
        this.runSendButtonAction.emit(event);
    }

    onCloseButtonAction(event) {
        this.closeButtonAction.emit(event);
    }

    ngOnInit() {}

}
