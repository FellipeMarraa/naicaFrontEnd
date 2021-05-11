import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'toolbar-left-section',
    template: `<div style="display: flex; align-items: center; justify-content: center" class="{{ cssClass }}"><ng-content></ng-content></div>`
})
export class ToolbarLeftSectionComponent implements OnInit {
    @Input() cssClass;

    constructor() { }

    ngOnInit() { }
}
