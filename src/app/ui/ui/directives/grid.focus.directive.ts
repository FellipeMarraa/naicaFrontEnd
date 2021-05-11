import {AfterViewInit, Directive, ElementRef, Input, OnDestroy} from "@angular/core";
import {DomHandler} from "../../app/services/dom.handler";
import {DxDataGridComponent} from "devextreme-angular";
import {Subscription} from "rxjs";

export class GridFocusDirectiveMetaData {
    dxDataGrid: DxDataGridComponent;
    handler: Function;
    context: any;
}

@Directive({
    selector: "[gridFocus]"
})
export class GridFocusDirective implements AfterViewInit, OnDestroy {

    @Input()
    gridFocus: GridFocusDirectiveMetaData;

    private gridSubscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private domHandler: DomHandler){
    }

    ngOnDestroy(){
        this.gridSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.gridSubscription = this.gridFocus.dxDataGrid.onContentReady.subscribe((event) => {
            setTimeout(() => {
                if(event.forceFocusHandler){
                    setTimeout(() => {
                        this.gridFocus.handler(this.gridFocus);
                    });
                }

                const column = this.findFirstColumn(this.elementRef);
                if (column){
                    column.on("focus", () => {
                        this.gridFocus.handler(this.gridFocus);
                    });
                }
            });
        });
    }

    findFirstColumn(element: ElementRef){
        const table = this.domHandler.jQueryWithContext(".dx-datagrid-rowsview table", this.domHandler.jQuery(element.nativeElement)).first();
        if (table){
            return this.domHandler.jQueryWithContext("td", table).first();
        }
        return null;
    }

}
