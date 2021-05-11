import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

@Component({
    selector: "list-toolbar",
    template: `
        <toolbar cssClass="{{cssClass}}" [showLeftSection]="showLeftSection" [showRightSection]="showRightSection">
            <toolbar-left-section cssClass="{{leftSectionCssClass}}">
                <div class="{{titleCssClass}}">{{ title }}</div>
            </toolbar-left-section>
            <toolbar-right-section cssClass="{{rightSectionCssClass}}">
                <div *ngIf="filterButtonShow" [ngStyle]="{'order': filterButtonOrder}" title="{{filterButtonTitle}}">
                    <action-button (action)="onFilterButtonAction($event)"
                                   cssClass="{{filterButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                [disabled]="filterButtonDisabled"
                                icon="{{filterButtonIconClass}}"
                                text="{{filterButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="newButtonShow" [ngStyle]="{'order': newButtonOrder}" title="{{newButtonTitle}}">
                    <action-button (action)="onNewButtonAction($event)"
                                   cssClass="{{newButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                [disabled]="newButtonDisabled"
                                icon="{{newButtonIconClass}}"
                                text="{{newButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="clearButtonShow" [ngStyle]="{'order': clearButtonOrder}" title="{{clearButtonTitle}}">
                    <action-button (action)="onClearButtonAction($event)"
                                   cssClass="{{clearButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                [disabled]="clearButtonDisabled"
                                icon="{{clearButtonIconClass}}"
                                text="{{clearButtonText}}">
                        </dx-button>
                    </action-button>
                </div>
                <div *ngIf="closeButtonShow" [ngStyle]="{'order': closeButtonOrder}" title="{{closeButtonTitle}}">
                    <action-button (action)="onCloseButtonAction($event)"
                                   cssClass="{{closeButtonCssClass}} {{allButtonsCssClass}}">
                        <dx-button
                                [disabled]="closeButtonDisabled"
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
export class ListToolbarComponent implements OnInit {
    constructor() {
    }

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
    @Input() filterButtonCssClass;

    @Input() newButtonCssClass;

    @Input() clearButtonCssClass;

    @Input() closeButtonCssClass;

    /**
     * filter button
     */
    @Input() filterButtonIconClass = "fa fa-search";
    @Input() filterButtonText = "Filtrar";
    @Input() filterButtonOrder = 0;
    @Input() filterButtonShow = true;
    @Input() filterButtonTitle = "Filtrar";
    @Input() filterButtonDisabled = false;

    /**
     * new button
     */
    @Input() newButtonIconClass = "fa fa-plus-square";
    @Input() newButtonText = "Novo";
    @Input() newButtonOrder = 1;
    @Input() newButtonShow = true;
    @Input() newButtonTitle = "Novo";
    @Input() newButtonDisabled = false;

    /**
     * clear button
     */
    @Input() clearButtonIconClass = "fa fa-eraser";
    @Input() clearButtonText = "Limpar";
    @Input() clearButtonOrder = 2;
    @Input() clearButtonShow = true;
    @Input() clearButtonTitle = "Limpar";
    @Input() clearButtonDisabled = false;


    /**
     * close button
     */
    @Input() closeButtonIconClass = "fa fa-times-circle";
    @Input() closeButtonText = "Fechar";
    @Input() closeButtonOrder = 3;
    @Input() closeButtonShow = true;
    @Input() closeButtonTitle = "Fechar";
    @Input() closeButtonDisabled = false;


    /**
     * listeners
     */
    @Output() filterButtonAction = new EventEmitter<any>();
    @Output() newButtonAction = new EventEmitter<any>();
    @Output() clearButtonAction = new EventEmitter<any>();
    @Output() closeButtonAction = new EventEmitter<any>();

    onFilterButtonAction(event) {
        if (!this.filterButtonDisabled) {
            this.filterButtonAction.emit(event);
        }
    }

    onNewButtonAction(event) {
        this.newButtonAction.emit(event);
    }

    onClearButtonAction(event) {
        this.clearButtonAction.emit(event);
    }

    onCloseButtonAction(event) {
        this.closeButtonAction.emit(event);
    }

    ngOnInit() {
    }
}
