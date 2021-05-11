import {AfterViewInit, Directive, ElementRef, OnInit, ViewContainerRef} from "@angular/core";
import {ContextBar} from "../../home/interfaces/context.bar";

/**
 * Use esta diretiva de atributo para declarar um elemento apto a ser
 * embedded em um CrudComponent. Isto permitirá ao componente CrudComponent
 * conhecer o componente embutido podendo notificá-los se o mesmo implementar
 * a interface ContextBar.
 *
 * Exemplo:
 * <ppa-context-bar contexBar></ppa-context-bar>
 *
 * export class PPAContextBarComponent extends BaseComponent implements ContextBar {}
 *
 */

@Directive({
    selector: "[contextBar]"
})
export class ContextBarDirective implements OnInit, AfterViewInit {

    hostComponent: ContextBar;

    constructor(private elemRef: ElementRef) {
    }

    ngOnInit(): void {
        this.assignHostComponent();
    }

    ngAfterViewInit(): void {
        this.assignHostComponent();
    }

    protected assignHostComponent(): void {
        this.hostComponent = this.elemRef.nativeElement.__component;
    }
}