import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";

@Component({
  selector: "toolbar",
  template: `
    <div #mainPanel style="display:flex; align-items: center; justify-content: space-between;box-sizing: border-box; min-height: 34px" [ngStyle]="{'width': width, 'height': height}" class="{{ cssClass }}">
        <ng-content *ngIf="showLeftSection" select="toolbar-left-section"></ng-content>
        <ng-content *ngIf="showRightSection" select="toolbar-right-section"></ng-content>
    </div>
  `
})
export class ToolbarComponent implements OnInit {
  constructor(private domHandler: DomHandler) {}

  @ViewChild("mainPanel")
  mainPanel: ElementRef;

  @Input() cssClass: string;

  @Input() showLeftSection: boolean = true;

  @Input() showRightSection: boolean = true;

  @Input() width: string = "100%";

  @Input() height: string;

  ngOnInit() {}

  getHeight(): number {
    return this.domHandler.jQuery(this.mainPanel.nativeElement).height();
  }
}
