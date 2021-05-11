import {AfterViewInit, Component, ContentChildren, OnDestroy, OnInit, QueryList} from "@angular/core";
import {DxChartComponent} from "devextreme-angular";
import {DomHandler} from "../../app/services/dom.handler";

@Component({
    selector: 'dx-chart-wrapper',
    template: `
        <div class="full-width">
            <ng-content></ng-content>
        </div>`
})
export class DxChartWrapper implements OnInit, AfterViewInit, OnDestroy {
    @ContentChildren(DxChartComponent) charts: QueryList<DxChartComponent>;

    constructor(private domHandler: DomHandler) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        if (this.charts) {
            this.charts.forEach((chart: DxChartComponent) => {
                //  do anything
            })
        }
    }

    ngOnDestroy(): void {
    }
}
