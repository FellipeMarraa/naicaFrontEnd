import {Directive, ElementRef, Injector} from "@angular/core";
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
    selector: "[dxAutoHeight]"
})
export class DxAutoHeightDirective extends AbstractAutoSize {

    constructor(private injector: Injector) {
        super(injector, false, true);
    }

    get elementRef() {
        return this.injector.get(ElementRef);
    }

    adjustHeight() {
        // let component: any = this.getHostComponent();
        // component.height = this.calcHeightBasedOnElement();
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
