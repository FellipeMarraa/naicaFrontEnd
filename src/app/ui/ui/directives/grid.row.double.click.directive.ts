import {AfterViewInit, Directive, ElementRef, Input, OnDestroy, ViewContainerRef} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {DxDataGridComponent} from "devextreme-angular";
import {Subscription} from "rxjs";

@Directive({
    selector: "[gridRowDoubleClick]"
})
export class GridRowDoubleClickDirective implements AfterViewInit, OnDestroy {

    @Input()
    gridRowDoubleClick: Function;

    private onRowPreparedSubscription: Subscription;

    constructor(private domHandler: DomHandler,
                private elementRef: ElementRef,
                private vcr: ViewContainerRef){

    }

    ngAfterViewInit(): void {
        const grid: DxDataGridComponent = this.getHostComponent();

        this.onRowPreparedSubscription = grid.onRowPrepared.subscribe(row => {
            if (row.rowType != "header") {
                this.domHandler.jQuery(row.rowElement).dblclick( e => {
                    if (this.gridRowDoubleClick) {
                        this.gridRowDoubleClick(grid, e, [row.data]);
                    }
                });
            }
        });

    }

    protected getHostComponent(): any {
        return this.vcr["_data"].componentView.component;
    }

    ngOnDestroy(): void {
        if(this.onRowPreparedSubscription){
            this.onRowPreparedSubscription.unsubscribe();
        }
    }

}
