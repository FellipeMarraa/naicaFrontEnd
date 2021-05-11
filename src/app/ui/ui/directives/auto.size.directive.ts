import {AbstractAutoSize} from "./abstract.auto.size";
import {Directive, ElementRef, Injector, ViewContainerRef} from "@angular/core";

/**
 * @deprecated Use <auto-size-container></auto-size-container>
 *
 * Esta diretiva foi desabilitada e deve ser removida em breve.
 * Os componentes TabPanel e CustomDataGrid agora preenchem o espaço disponível
 * por padrão. Caso precise adicionar este comportamento a outro componente, use
 * o componente AutoSizeContainer
 */
@Directive({
    selector: '[autoSize]'
})
export class AutoSizeDirective extends AbstractAutoSize {

    constructor(private injector: Injector) {
        super(injector, true, true);
    }

    get elementRef() {
        return this.injector.get(ElementRef);
    }

    adjustWidth() {
        // this.getDomHandler().jQuery(this.getElementRef().nativeElement).width(this.getWidthWindowComponent());
    }

    adjustHeight() {
        // this.getDomHandler().jQuery(this.getElementRef().nativeElement).height(this.calcHeightBasedOnElement());
    }

    ngAfterViewInit(): void {
        // this.adjustInit();
        // this.windowResizeSubscription = this.getAppState().resizedWindow.subscribe(context => {
        //
        //     if (this.triggerWidth) {
        //         this.adjustWidth();
        //     }
        //     if (this.triggerHeight) {
        //         this.adjustHeight();
        //     }
        //
        // });
    }

    ngOnDestroy(): void {
        // if (this.windowResizeSubscription) {
        //     this.windowResizeSubscription.unsubscribe();
        // }
    }

}
