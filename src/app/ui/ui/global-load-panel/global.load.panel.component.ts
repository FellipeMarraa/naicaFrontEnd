import {Component, Input, OnInit} from "@angular/core";

@Component({
    selector: 'global-load-panel',
    templateUrl: './global.load.panel.component.html'
})
export class GlobalLoadPanelComponent implements OnInit {

    @Input()
    positionId: string;

    @Input()
    visible: boolean;

    position: any;

    ngOnInit(): void {
        this.position = {of: '#' + this.positionId};
    }
}
