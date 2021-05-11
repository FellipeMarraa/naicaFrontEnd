import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'toolbar-right-section',
    template: `<div style="display: flex; align-items: center; justify-content: center" class="{{ cssClass }}">
        <ng-content></ng-content>
    </div>`
})
export class ToolbarRightSectionComponent implements OnInit {
    @Input() cssClass;
    
    constructor() { }

    ngOnInit() { }
}
