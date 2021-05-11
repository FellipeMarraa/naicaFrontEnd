import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
    selector: '[relatorio-host]'
})
export class RelatorioHostDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}