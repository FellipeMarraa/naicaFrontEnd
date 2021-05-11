import {Component, Input, ViewChild} from "@angular/core";
import {ToolbarComponent} from "../toolbar/toolbar.component";

import {ViewEncapsulation} from "@angular/core"

@Component({
    selector: "grid-toolbar",
    styleUrls: ['grid.toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,

    template: `
        <toolbar #toolbar *ngIf="visible" cssClass="{{cssClass}} default-grid-toolbar" [showLeftSection]="true" [showRightSection]="true" [width]="width" [height]="height">
            <toolbar-left-section cssClass="{{leftSectionCssClass}}">
                <div class="{{titleCssClass}}">{{ title }}</div>
            </toolbar-left-section>
            <toolbar-right-section cssClass="{{rightSectionCssClass}}">
                <ng-content></ng-content>
            </toolbar-right-section>
        </toolbar>
    `
})
export class GridToolbarComponent{

    @ViewChild("toolbar")
    toolbar: ToolbarComponent;

    @Input() cssClass: string;

    @Input() rightSectionCssClass: string;

    @Input() leftSectionCssClass: string;

    @Input() showLeftSection: boolean = true;

    @Input() showRightSection: boolean = true;

    @Input() title;

    @Input() titleCssClass;

    @Input() width: string;

    @Input() height: string;

    @Input() visible: boolean = true;

    getHeight(): number {
        return this.toolbar.getHeight();
    }

}
