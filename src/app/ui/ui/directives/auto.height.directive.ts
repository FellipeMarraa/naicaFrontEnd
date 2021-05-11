import {Directive, ElementRef, Injector, Input, ViewContainerRef} from "@angular/core";
import {AbstractAutoSize} from "./abstract.auto.size";

/**
 * @deprecated Use <auto-size-container></auto-size-container>
 *
 * Esta diretiva foi desabilitada e deve ser removida em breve.
 * Os componentes TabPanel e CustomDataGrid agora preenchem o espaço disponível
 * por padrão. Caso precise adicionar este comportamento a outro componente, use
 * o componente AutoSizeContainer
 */
@Directive({
    selector: "[autoHeight]"
})
export class AutoHeightDirective extends AbstractAutoSize {

    @Input() autoHeight: boolean; //use siblings to calc

    @Input() fixedHeight: number; //fixa a altura em um valor específico

    constructor(private injector: Injector) {
        super(injector,false, true);
    }

    get elementRef() {
        return this.injector.get(ElementRef);
    }

    adjustHeight() {
        // let h = this.fixedHeight ? this.fixedHeight : this.calcHeightBasedOnElement(this.autoHeight);
        // this.getDomHandler().jQuery(this.getElementRef().nativeElement).height(h);
        // let component: AdjustHeight = this.getHostComponent();
        // if (component && component.adjustHeight) {
        //     component.adjustHeight(h);
        // }
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
